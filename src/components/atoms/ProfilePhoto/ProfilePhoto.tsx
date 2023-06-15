import Photo from "../../../assets/profile.jpeg"

const ProfilePhoto = () => {
  return (
    <div className="w-[200px] absolute left-[50%] transform -translate-x-[50%] drop-shadow-xl mx-auto -mt-[140px]">
      <img src={Photo} alt="about" className="rounded-[20px]"/>
    </div>
  );
};

export default ProfilePhoto;
