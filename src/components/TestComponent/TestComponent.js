import classes from './TestComponent.module.css'
import Multiselect from "../../UI/MultiSelect/MultiSelect";

const options = [{name: "moamen", id: 1}, {name: "kenan", id: 2}]

const TestComponent = () => {
    return <div className={classes.container}>
        <Multiselect options={options} selectedValues={options.slice(0, 1)}
                     onSelect={() => {}}
                     onRemove={() => {}}
                     displayValue={"name"}
        />
    </div>
}

export default TestComponent;