
import classes from './Checkbox.module.css'


const CheckBox = (props) => {
    return <div className={classes.container}>
        <input type={"checkbox"} className={classes.customCheckbox}/>
        <label  className={classes.customLabel}/>
    </div>
}

export default CheckBox;