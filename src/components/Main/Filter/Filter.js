import classes from './Filter.module.css';
import {FaFilter, RiSaveFill} from "react-icons/all";


const Filter = (props) => {
    return <div className={classes.container}>
        <div className={classes.filters}>
            {props.filters.map(el => <div className={classes.filter}> {el} </div> )}
        </div>
        <div className={classes.actions}>
            <div className={classes.action}><FaFilter color={"var(--secondary-color)"} size={35}/></div>
            <div className={classes.action}><RiSaveFill color={"var(--secondary-color)"} size={40}/></div>
        </div>
    </div>
    
}

export default Filter;