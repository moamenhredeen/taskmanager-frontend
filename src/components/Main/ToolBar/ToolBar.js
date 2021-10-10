
import classes from './ToolBar.module.css';
import Input from "../../../UI/Input/Input";
import {IoMdArrowRoundBack, IoMdArrowRoundForward, MdAddToPhotos} from "react-icons/all";


const ToolBar = () => {
    return <div className={classes.container}>
        <div className={classes.navigationActions}>
            <div className={[classes.backward, classes.action].join(' ')}>
                <IoMdArrowRoundBack size={30}/>
            </div>
            <div className={[classes.forward, classes.action].join(' ')}>
                <IoMdArrowRoundForward size={30}/>
            </div>
        </div>
        <div className={classes.searchInput}>
            <Input type={"text"} name={"main-search"} placeholder={"Search for a Task"} />
        </div>
        <a type={"button"} name={"addTask"} className={classes.addTaskBtn}>
            <MdAddToPhotos size={40}/>
        </a>
    </div>
}

export default ToolBar;