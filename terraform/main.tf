terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.34.0"
    }
  }

# ENV variables for access_key and secret_key
  backend "s3" {
    bucket = "ljps"
    key    = "terraform/state"
    region = "ap-southeast-1"
  }
}

# ENV variables for access_key and secret_key
provider "aws" {
  region = "ap-southeast-1"
}

module "vpc" {
  source = "./modules/vpc"
}

resource "aws_iam_role" "main_role" {
  name               = "ljps-role"
  assume_role_policy = file("./policies/ljps-role-trust-policy.json")
  managed_policy_arns = var.role_managed_policies
}

resource "aws_iam_instance_profile" "main_profile" {
  name = "ljps-instance-profile"
  role = aws_iam_role.main_role.id
}

resource "aws_security_group" "ljps_app_sg" {
  name        = "ljps-app-sg"
  description = "Security group for LJPS API App"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description      = "App port"
    from_port        = 5000
    to_port          = 5000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
    description      = "Allow SSH and SCP"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    description      = "default outbound rule"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.app_sg_name
  }
}

resource "aws_security_group" "ljps_rds_sg" {
  name        = "ljps-rds-sg"
  description = "Security group for LJPS RDS database"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description      = "default inbound rule"
    from_port        = 3306
    to_port          = 3306
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    description      = "default outbound rule"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.rds_sg_name
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "ljps"
  subnet_ids = [module.vpc.public_subnet_1_id, module.vpc.public_subnet_2_id]

  tags = {
    Name = var.db_subnet_group_name
  }
}

resource "aws_db_instance" "main" {
  allocated_storage      = 10
  db_subnet_group_name   = aws_db_subnet_group.main.id
  engine                 = "mysql"
  identifier             = "ljps-spm-g2t4-terraform"
  instance_class         = "db.t2.micro"
  multi_az               = false
  username               = var.DB_USERNAME
  password               = var.DB_PASSWORD
  port                   = var.DB_PORT
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.ljps_rds_sg.id]
  skip_final_snapshot    = true
  
  tags = {
    Name = var.rds_name
  }
}

resource "aws_instance" "staging" {
  ami                         = "ami-07651f0c4c315a529"
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.main_profile.name
  instance_type               = "t2.micro"
  key_name                    = "ljps-ec2"
  subnet_id                   = module.vpc.public_subnet_1_id
  user_data                   = file("./ec2-user-data.sh")
  vpc_security_group_ids      = [aws_security_group.ljps_app_sg.id]

  tags = {
    Name = var.staging_instance_name
  }
}