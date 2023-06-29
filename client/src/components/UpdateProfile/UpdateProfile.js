import React, { useEffect, useState } from "react";
import userImg from "../../Assets/user.png";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../../redux/slices/appConfigSlice";
import dummyImg from '../../Assets/user.png'

function UpdateProfile() {
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [userImage, setUserImage] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        setName(myProfile?.name || '');
        setBio(myProfile?.bio || '');
        setUserImage(myProfile?.avatar?.url);
    }, [myProfile]);

    console.log("profile : " , myProfile);

    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () =>{
            if(fileReader.readyState === fileReader.DONE){
                setUserImage(fileReader.result);
            }
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        dispatch(updateMyProfile({
            name ,
            bio,
            userImage,
        }))
    }

    return (
        <div className="update-profile">
            <div className="container">
                <div className="left-side">
                    <div className="input-user-img">
                        <label htmlFor="inputImg" className="labelImg">
                            <img src={userImage ? userImage : dummyImg } alt={name} />
                        </label>
                        <input
                            className="inputImg"
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <div className="right-side">
                    <form onSubmit={handleSubmit}>
                        <input
                            value={name}
                            type="text"
                            placeholder="Your Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            value={bio}
                            type="text"
                            placeholder="Your Bio"
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <input type="submit" className="btn-primary" onSubmit={handleSubmit} />
                    </form>
                    <button className="btn-delete btn-primary">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
