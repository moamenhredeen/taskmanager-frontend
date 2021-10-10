import ActivityBar from "../ActivityBar/ActivityBar";
import ToolBar from "./ToolBar/ToolBar";
import classes from './Main.module.css';
import Filter from "./Filter/Filter";
import Task from "./Task/Task"

const filters = ["Property", "Title", "Status"]
const TaskList = [
    {title:"first task", body:"body of the first task", priority:"HIGH", status:"TODO"},
    {title:"first task", body:"body of the first task", priority:"HIGH", status:"TODO"},
    {title:"first task", body:"body of the first task", priority:"HIGH", status:"TODO"}
]



const Main = () => {
    return (<div>
        <ActivityBar/>
        <main className={classes.mainContainer}>
            <ToolBar/>
            <Filter filters={filters}/>
            {TaskList.map(el => <Task
                title={el.title}
                body={el.body}
                priority={el.priority}
                status={el.status}
            />)}

        </main>
    </div>);
}

export default Main;
