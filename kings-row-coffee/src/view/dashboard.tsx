import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardRevenue from "../components/card/dashboard.revenue.tsx";
import ApexLineChart from "../components/component/chart/ApexLineChart.tsx";
import Earnings from "../components/card/Earnings.tsx";
import Header from "../components/layout/main/header.tsx";
import Profile from "../components/layout/main/profile.tsx";

const Dashboard = ():JSX.Element => {

    return (
        <section className={'w-full h-full bg-[#f6f6f6] overflow-y-scroll'}>
            <div className="row">
                <div className={'col-md-12 px-12 py-2'}>
                    <Header/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 col-sm-6 pl-12 py-2">
                    <Earnings success={'#f6f4f4'}/>
                </div>
                <div className="col-md-8 col-sm-6 pr-12 py-2">
                    <div className={'w-full h-full rounded-xl bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]'}>
                        <DashboardRevenue/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 col-sm-6 pl-12 h-auto py-2 ">
                    <ApexLineChart direction={'ltr'} warning={'#FFA16C'} />
                </div>
                <div className={'col-md-4 pl-0 py-2 pr-12 m-0'}>
                    <Profile/>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
