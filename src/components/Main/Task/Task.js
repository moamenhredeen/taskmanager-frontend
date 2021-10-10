
import classes from './Task.module.css'
import CheckBox from "../../../UI/Checkbox/Checkbox";

const Task = (props) => {
    return <div className={classes.container}>
        <CheckBox/>
        <div className={classes.title}>{props.title}</div>
        <div className={classes.priority}>{props.priority}</div>
        <div className={classes.status}>{props.status}</div>
    </div>
}

export default Task;