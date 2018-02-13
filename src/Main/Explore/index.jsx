import React from 'react'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import './style.scss'
import * as ExploreActions from "./action";
import SimpleUserCard from "src/components/SimpleUserCard";
import TweetCard from "src/components/TweetCard";
import ScrollHOC from "src/shared/HOC/ScrollHOC";


class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.listUpdating = false;
        this.state = {
            nowPage: this.props.nowPage,
            tweetList: this.props.tweetList,
            userList: this.props.userList
        }
    }


    listUpdate() {
        this.listUpdating = true;
        this.props.tweetNextPage()
    }

    receiveDistance(distance) {
        if (this.listUpdating === false && distance > -70) {
            this.listUpdate()
        }
    }


    init() {
        // 初始两倍数据
        this.props.userGet();
        for (let i = 0; i < 2; i++) {
            this.props.tweetNextPage();
        }
    }


    componentDidMount() {
        //初始化
        this.init()
    }

    componentWillReceiveProps(nextProps) {
        // 将state 与redux 同步
        this.setState({
            tweetList: nextProps.tweetList,
            userList: nextProps.userList
        }, () => {
            this.listUpdating = false;
        })
    }

    componentWillUnmount() {
        // 清空列表
        this.props.resetAll();
    }


    render() {
        return (
            <div id="explore" className="container">
                <div className="explore-header">
                    <header>
                        <span>发现用户</span>
                        <a href="" className="eh-more-link"><span>查看全部</span></a>
                    </header>
                    <div className="eh-users-con row">
                        {this.state.userList.map((user, index) => {
                            if (index < 3) {
                                return <div className="user-card-con col-4">
                                    <SimpleUserCard
                                        followButton={true}
                                        verticle={true}
                                        user={user}
                                    />
                                </div>
                            }
                        })}
                    </div>
                </div>
                <div className="explore-main">
                    <header>
                        <span>探索</span>
                    </header>
                    <div className="tweets-con">
                        <div className="row">

                            {this.state.tweetList.map((tweet) => {
                                return (
                                    <div className="tweet-card-con col-4">
                                        <TweetCard tweet={tweet}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {this.props.children}
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        nowPage: state.Explore.nowPage,
        tweetList: state.Explore.tweetList,
        userList: state.Explore.userList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        tweetNextPage: bindActionCreators(ExploreActions.recommendTweetsNextPage, dispatch),
        resetAll: bindActionCreators(ExploreActions.resetAll, dispatch),
        userGet: bindActionCreators(ExploreActions.recommendUserGet, dispatch),

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScrollHOC(Explore))

