import { useState, useEffect } from "react";

function ProfileAvatar() {

  const [avatar,setAvatar] = useState(null);

  useEffect(()=>{

    const savedAvatar = localStorage.getItem("avatar");

    if(savedAvatar){
      setAvatar(savedAvatar);
    }

  },[]);


  function handleUpload(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem("avatar", reader.result);
      setAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  }


  return (

    <div className="profile-avatar">

      <label className="avatar-upload">

        <img
          src={avatar || "https://ui-avatars.com/api/?name=User"}
          alt="profile avatar"
          className="avatar"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          hidden
        />

      </label>

    </div>

  );
}

export default ProfileAvatar;