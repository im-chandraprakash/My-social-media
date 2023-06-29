import React, { useEffect } from "react";
import Follower from "../Follower/Follower";
import Post from "../Post/Post";
import "./Feed.scss";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";

function Feed() {
    const dispatch = useDispatch();
    const feedData = useSelector((state) => state?.feedDataReducer?.feedData);

    useEffect(() => {
        dispatch(getFeedData());
    }, []);

    return (
        <div className="Feed">
            <div className="container">
                <div className="left-part">
                    {feedData?.posts?.map((post, id) => (
                        <Post key={id} post={post}></Post>
                    ))}
                </div>
                <div className="right-part">
                    <div className="followings">
                        <h3 className="title   ">You are following</h3>
                        {feedData?.followings?.map((user, id) => (
                            <Follower key={id} user={user} />
                        ))}
                    </div>
                    <div className="suggestions">
                        <h3 className="title">Suggested For You</h3>
                        {feedData?.suggestions?.map((user, id) => (
                            <Follower key={id} user={user} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feed;
