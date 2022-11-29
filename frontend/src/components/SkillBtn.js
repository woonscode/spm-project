import {useState} from 'react';

export default function SkillButton({name,setSelectedSkills,selectedSkills,type}) {
  const [isActive, setIsActive] = useState(false);

  const updateSelection = (skill) =>{
    if (selectedSkills.length && selectedSkills.includes(skill)){
     
        let newArr = selectedSkills.filter((i)=>{return i!==skill})
       
        setSelectedSkills(newArr);
    }else{
        setSelectedSkills([...selectedSkills,skill])
    }
}

  const handleClick = () => {
    // 👇️ toggle
    setIsActive(current => !current);
    updateSelection(name);

    // 👇️ or set to true
    // setIsActive(true);
  };

  return (
    <div>
      <button
        style={{
            border: '1px solid #d77a61', borderRadius: '5px',
            padding: 10, margin: 'auto', display: 'block',
            minWidth: '150px', maxWidth: '150px',
            backgroundColor: isActive ? '#d77a61' : 'white',
            color: isActive ? 'white' : '#d77a61', marginBottom: 8
            
        }}
        onClick={type==="Mutable"?handleClick:null}
      >
        {name}
      </button>
    </div>
  );
}

