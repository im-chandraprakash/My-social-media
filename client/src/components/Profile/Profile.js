import React, { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../Create Post/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";

function Profile() {
    const navigate = useNavigate();
    const params = useParams("");
    const paramsUserId = params?.userId;
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.postsReducer.userProfile);
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    const feedData = useSelector((state) => state.feedDataReducer.feedData);
    const [isMyyProfile, setIsMyProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        dispatch(
            getUserProfile({
                userId: paramsUserId,
            })
        );
        setIsMyProfile(myProfile?._id === paramsUserId);
        setIsFollowing(
            feedData?.followings?.find((item) => item._id === paramsUserId)
        );
    }, [myProfile, paramsUserId, feedData]);

    function handleUserFollow() {
        dispatch(
            followAndUnfollowUser({
                userIdToFollow: paramsUserId,
            })
        );
    }

    //  console.log("myProfile data :" , myProfile);
    return (
        <div className="Profile">
            <div className="container">
                <div className="left-part">
                    {isMyyProfile && <CreatePost />}
                    {userProfile?.posts?.map((post, id) => (
                        <Post key={id} post={post} />
                    ))}
                </div>
                <div className="right-part">
                    <div className="profile-card">
                        <img
                            className="user-img"
                            src={userProfile?.avatar?.url}
                            alt=""
                        />
                        <h3 className="user-name">{userProfile?.name}</h3>
                        <p className="user-bio">{userProfile?.bio}</p>
                        <div className="follower-info">
                            <h4>{` ${userProfile?.followers?.length} Followers`}</h4>
                            <h4>{`${userProfile?.followings?.length} Followings`}</h4>
                        </div>
                        {!isMyyProfile && (
                            <h5
                                style={{ marginTop: "10px" }}
                                onClick={handleUserFollow}
                                className={
                                    isFollowing
                                        ? "hover-link follow-link"
                                        : "btn-primary"
                                }
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </h5>
                        )}

                        {isMyyProfile && (
                            <button
                                className="update-profile btn-secondry"
                                onClick={() => navigate("/updateProfile")}
                            >
                                Update Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
