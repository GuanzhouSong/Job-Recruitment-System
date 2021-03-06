import React, {Component} from 'react';
import './LeftPanelStudents.css';
import {Link, Redirect} from 'react-router-dom';
import JobList from "./Components/JobListPost";
import JobListApply from "./Components/JobListApply";
import Divider from "@material-ui/core/Divider";
import Logout from "./logout";
import {auth, database} from "./firebase";
import PureRenderMixin from "react-addons-pure-render-mixin";
import JobListPost from "./Components/JobListPost";
import withAuthorization from "./withAuthorization";

class LeftPanelStudents extends React.Component {

    constructor(props) {
        super(props);
        this.data = [];
        this.state = {
            user: 'guanzhou',
            postdata: [],
            applydata: [],
            loading: true
        }
        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        let ref = database.ref("user-task/" + auth.currentUser.uid + '/task');
        this.data = ref.on("value", (snapshot) => {
            const datalist = [];
            snapshot.forEach(data => {
                datalist.push(data.val());
            });
            this.setState({
                postdata: datalist
            });
        });

        ref = database.ref("user-applicant/" + auth.currentUser.uid + "/applicant");
        this.data = ref.on("value", (snapshot) => {
            const datalist = [];
            snapshot.forEach(data => {
                let item = data.val();
                datalist.push(item);
            });
            console.log(datalist);
            this.setState({
                loading: false,
                applydata: datalist
            });
        });
    }


    render() {
        console.log(this.state.applydata)
        //const {user,loading, datalist} = this.state;
        return this.state.loading ? (
                <div>
                    loading...
                </div>
            ) :
            (
                <div>
                    <div>

                        {this.state.user ?
                            <div>

                                <div id="mytask_background" >
                                    <h2 id="mytask">My Task</h2>

                                </div>
                                <div style={{
                                    margin: 'auto',
                                    height: 'auto',
                                    overflow: 'auto',
                                    backgroundColor: '#1f3b51'
                                }}>
                                    <h3 id="mypost">My Post</h3>
                                    <Divider/>
                                    {this.state.postdata.length ?
                                        <div style={{'padding-top': '20px', 'padding-left': '30px','padding-bottom': '20px'}}>
                                        <JobListPost id='joblist' data={this.state.postdata}/>
                                        </div>:
                                        <div style={{'padding-top': '20px', 'padding-left': '30px','padding-bottom': '20px'}}>
                                            <Link style={{'color': '#fb601d'}} to="/postjob">
                                                <h5>Post a Task Now!</h5>
                                            </Link>
                                        </div>

                                    }

                                </div>
                                <div style={{
                                    margin: 'auto',
                                    height: 'auto',
                                    overflow: 'auto',
                                    backgroundColor: '#4b6273'
                                }}>
                                    <h3 id="mypost">My Application</h3>
                                    <Divider/>
                                    {this.state.applydata.length ?
                                        <JobListApply data={this.state.applydata}/> :
                                        <div style={{'paddingTop': '20px', 'paddingLeft': '30px','paddingBottom': '20px'}}>
                                            <Link style={{'color': '#fb601d'}} to="/">
                                                <h5>Apply Now!</h5>
                                            </Link>
                                        </div>

                                    }
                                </div>

                            </div>


                            :
                            //if not log in, redirect to login page.
                            <Redirect to="/"/>
                        }


                    </div>
                    <Logout {...this.props}/>
                </div>
            )
    }
}
const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)( LeftPanelStudents);