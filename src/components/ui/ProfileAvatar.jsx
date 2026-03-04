import { useState, useEffect, useRef } from "react";

function ProfileAvatar(){

  const [avatar,setAvatar] = useState(null);
  const inputRef = useRef();

  useEffect(()=>{

    const savedAvatar = localStorage.getItem("profile-avatar");

    if(savedAvatar){
      setAvatar(savedAvatar);
    }

  },[]);

  function handleUpload(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = ()=>{
      setAvatar(reader.result);
      localStorage.setItem("profile-avatar", reader.result);
    };

    reader.readAsDataURL(file);
  }

  return(
    <div className="profile-avatar">

      <img
        src={avatar || "https://i.pravatar.cc/40"}
        alt="profile"
        onClick={()=>inputRef.current.click()}
      />

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{display:"none"}}
        onChange={handleUpload}
      />

    </div>
  );

}

export default ProfileAvatar;