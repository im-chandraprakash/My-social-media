import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import "./Follower.scss";
import { useDispatch, useSelector } from "react-redux";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import { useNavigate } from "react-router-dom";

function Follower({ user }) {
    const dispatch = useDispatch();
    const feedData = useSelector((state) => state.feedDataReducer.feedData);
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState();
    useEffect(() => {
        setIsFollowing(
            feedData.followings.find((item) => item._id === user._id)
        );
    }, [feedData]);

    async function handleUserFollow() {
        dispatch(
            followAndUnfollowUser({
                userIdToFollow: user._id,
            })
        );
    }
    return (
        <div className="follower">
            <div className="user-info" onClick={()=> navigate(`/profile/${user._id}`)}>
                <Avatar src={user?.avatar?.url} />
                <h4 className="name">{user?.name}</h4>
            </div>
            <h5
                onClick={handleUserFollow}
                className={
                    isFollowing ? "hover-link follow-link" : "btn-primary"
                }
            >
                {isFollowing ? "Unfollow" : "follow"}
            </h5>
        </div>
    );
}

export default Follower;
