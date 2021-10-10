import classes from './ActivityBar.module.css'
import {AiOutlineMenu, IoSettingsSharp, MdAccountCircle, MdLogout} from "react-icons/all";

const ActionSearch = () => {
    return <div className={classes.container}>
        <div className="top-actions">
            <div className={classes.action}>
                <AiOutlineMenu size={30} color={"#202020"}/>
            </div>
            <div className={classes.action}>
                <IoSettingsSharp size={30} color={"#202020"}/>
            </div>
        </div>
        <div className="bottom-actions">
            <div className={classes.action}>
                <MdAccountCircle size={30} color={"#202020"}/>
            </div>
            <div className={classes.action}>
                <MdLogout size={30} color={"#202020"}/>
            </div>
        </div>
    </div>;
}

export default ActionSearch;