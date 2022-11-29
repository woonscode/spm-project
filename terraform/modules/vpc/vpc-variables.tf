variable "vpc_name" {
  description = "Name of VPC"
  type = string
  default = "LJPS-vpc"
}

variable "public_subnet_1_name" {
  description = "Name of public subnet 1"
  type = string
  default = "LJPS-public-subnet-1"
}

variable "public_subnet_2_name" {
  description = "Name of public subnet 2"
  type = string
  default = "LJPS-public-subnet-2"
}

variable "igw_name" {
  description = "Name of Internet Gateway"
  type = string
  default = "LJPS-vpc-igw"
}

variable "public_rt_name" {
  description = "Name of public route table"
  type = string
  default = "LJPS-vpc-public-rt"
}