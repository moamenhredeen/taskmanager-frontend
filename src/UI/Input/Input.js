
import classes from './Input.module.css'

const Input = (props) => {
    return <input
        className={classes.customInput}
        value={props.value}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
    />
}

export default Input;