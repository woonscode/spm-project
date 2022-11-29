import {useState} from 'react';

export default function SkillButton() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // 👇️ toggle
    setIsActive(current => !current);

    // 👇️ or set to true
    // setIsActive(true);
  };

  return (
    <div>
      <button
        style={{
            border: '1px solid rgba(0, 51, 102, 1)', borderRadius: '5px', 
            padding: 5, margin: 5, width: '150px', size: 'large',
            backgroundColor: isActive ? 'rgba(0, 51, 102, 1)' : 'white',
            color: isActive ? 'white' : 'rgba(0, 51, 102, 1)',
        }}
        onClick={handleClick}
      >
        Skill XXX
      </button>
    </div>
  );
}

