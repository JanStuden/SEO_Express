import mongoose from "mongoose";

const dashboardSchema = mongoose.Schema({
    dashboardName: {
        type: String,
        unique: true,
        required: true
    },
    dataSource: {
        type: String,
        required: true,
    },
    KPIs: [
        {}
    ],
    userWhiteList: [
    ],
    creator: {
        type: String,
    },
    creationDate: {
        type: String,
    },    
})

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;