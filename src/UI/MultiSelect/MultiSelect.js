import React, {useState} from "react";
import CloseCircle from './assets/closeCircle.svg';
import CloseCircleDark from './assets/closeCircleDark.svg';
import CloseLine from './assets/closeLine.svg';
import CloseSquare from './assets/closeSquare.svg';
import DownArrow from './assets/downArrow.svg';

// TODO switch to css module
import './MultiSelect.css'

const closeIconTypes = {
    circle: CloseCircleDark,
    circle2: CloseCircle,
    close: CloseSquare,
    cancel: CloseLine
};

// TODO : show number of the selected item if more than one item is selected
// TODO : show the selected item if only one item is seleted
// TODO : clear item => unselect all items
const Multiselect = (props) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState(props.options);
    const [selectedValues, setSelectedValues] = useState(props.selectedValues);
    const [filteredOptions, setFilteredOptions] = useState(props.options);
    const [unfilteredOptions, setUnfilteredOptions] = useState(props.options);
    const [preSelectedValues, setPreSelectedValues] = useState(props.selectedValues);
    const [toggleOptionsList, setToggleOptionsList] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(props.showCheckbox);
    const [keepSearchTerm, setKeepSearchTerm] = useState(props.keepSearchTerm);
    const [highlightOption, setHighlightOption] = useState(props.avoidHighlightFirstOption ? -1 : 0);
    const [groupedObject, setGroupedObject] = useState([]);
    const [closeIconType, setCloseIconType] = closeIconTypes[props.closeIcon] || closeIconTypes['circle']
    const [optionTimeout, setOptionTimeout] = useState(null);
    const searchBox = React.createRef();
    const searchWrapper = React.createRef();

    const getSelectedItems = () => {
        return selectedValues;
    }

    const getSelectedItemsCount = () => {
        return selectedValues.length;
    }

    // TODO : use react hooks instead of component lifecycle methods
    // const componentDidMount = ()  => {
    //     this.initialSetValue();
    //     // @ts-ignore
    //     this.searchWrapper.current.addEventListener("click", this.listenerCallback);
    // }
    // const componentDidUpdate = (prevProps) => {
    //     const { options, selectedValues } = this.props;
    //     const { options: prevOptions, selectedValues: prevSelectedvalues } = prevProps;
    //     if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
    //         this.setState({ options, filteredOptions: options, unfilteredOptions: options }, this.initialSetValue);
    //     }
    //     if (JSON.stringify(prevSelectedvalues) !== JSON.stringify(selectedValues)) {
    //         this.setState({ selectedValues: Object.assign([], selectedValues), preSelectedValues: Object.assign([], selectedValues) }, this.initialSetValue);
    //     }
    // }
    //
    // listenerCallback() {
    //     // @ts-ignore
    //     this.searchBox.current.focus();
    // }
    // componentWillUnmount() {
    //     // @ts-ignore
    //     if (this.optionTimeout) {
    //         // @ts-ignore
    //         clearTimeout(this.optionTimeout);
    //     }
    //     // @ts-ignore
    //     this.searchWrapper.current.removeEventListener('click', this.listenerCallback);
    // }

    // TODO : search logic
    const onChange = (event) => {
        const {onSearch} = props;
        setInputValue(event.target.value);
        if (onSearch) {
            onSearch(event.target.value);
        }
    }

    const matchValues = (value, search) => {
        if (props.caseSensitiveSearch) {
            return value.indexOf(search) > -1;
        }
        if (value.toLowerCase) {
            return value.toLowerCase().indexOf(search.toLowerCase()) > -1;
        }
        return value.toString().indexOf(search) > -1;
    }

    const groupByOptions = (options) => {
        const {groupBy} = props;
        const groupedObject = options.reduce(function (r, a) {
            const key = a[groupBy] || "Others";
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create({}));
        setGroupedObject(groupedObject);
    }

    const filterOptionsByInput = () => {
        const {isObject, displayValue} = props;
        if (isObject) {
            setOptions(filteredOptions.filter(i => matchValues(i[displayValue], inputValue)));
        } else {
            setOptions(filteredOptions.filter(i => matchValues(i, inputValue)));
        }
        groupByOptions(options);
        setOptions(options);
    }

    // Skipcheck flag - value will be true when the func called from on deselect anything.
    const removeSelectedValuesFromOptions = (skipCheck) => {
        const {isObject, displayValue, groupBy} = props;
        if (!skipCheck && groupBy) {
            groupByOptions(options);
        }
        if (!selectedValues.length && !skipCheck) {
            return;
        }
        if (isObject) {
            let optionList = unfilteredOptions.filter(item => {
                return selectedValues.findIndex(
                    v => v[displayValue] === item[displayValue]
                ) === -1;
            });
            if (groupBy) {
                groupByOptions(optionList);
            }
            setOptions(optionList);
            setFilteredOptions(optionList);
            // TODO : this.filterOptionsByInput
            return;
        }
        let optionList = unfilteredOptions.filter(
            item => selectedValues.indexOf(item) === -1
        );

        setOptions(optionList);
        setFilteredOptions(optionList);
        // TODO : this.filterOptionsByInput
    }

    const onRemoveSelectedItem = (item) => {
        const {onRemove, showCheckbox, displayValue, isObject} = props;
        let index;
        if (isObject) {
            index = selectedValues.findIndex(
                i => i[displayValue] === item[displayValue]
            );
        } else {
            index = selectedValues.indexOf(item);
        }
        selectedValues.splice(index, 1);
        onRemove(selectedValues, item);
        setSelectedValues(selectedValues, () => {
            if (!showCheckbox) {
                removeSelectedValuesFromOptions(true);
            }
        });
        if (!props.closeOnSelect) {
            searchBox.current.focus();
        }
    }

    const onArrowKeyNavigation = (e) => {
        const {disablePreSelectedValues} = props;
        if (e.keyCode === 8 && !inputValue && !disablePreSelectedValues && selectedValues.length) {
            onRemoveSelectedItem(selectedValues.length - 1);
        }
        if (!options.length) {
            return;
        }
        if (e.keyCode === 38) {
            if (highlightOption > 0) {
                setHighlightOption(prev => prev - 1);
            } else {
                setHighlightOption(options.length - 1);
            }
        } else if (e.keyCode === 40) {
            if (highlightOption < options.length - 1) {
                setHighlightOption(prev => prev + 1);
            } else {
                setHighlightOption(0);
            }
        } else if (e.key === "Enter" && options.length && toggleOptionsList) {
            if (highlightOption === -1) {
                return;
            }
            onSelectItem(options[highlightOption]);
        }
        // TODO: Instead of scrollIntoView need to find better soln for scroll the dropwdown container.
        // setTimeout(() => {
        //   const element = document.querySelector("ul.optionContainer .highlight");
        //   if (element) {
        //     element.scrollIntoView();
        //   }
        // });
    }

    const onSingleSelect = (item) => {
        setSelectedValues(item);
        setToggleOptionsList(false);
    }

    const isSelectedValue = (item) => {
        const {isObject, displayValue} = props;
        if (isObject) {
            return selectedValues.filter(i => i[displayValue] === item[displayValue]).length > 0;
        }
        return selectedValues.filter(i => i === item).length > 0;
    }

    const onSelectItem = (item) => {
        const {selectionLimit, onSelect, singleSelect, showCheckbox} = props;
        if (!keepSearchTerm) {
            setInputValue('');
        }
        if (singleSelect) {
            onSingleSelect(item);
            // onSelect handler (props)
            onSelect([item], item);
            return;
        }
        if (isSelectedValue(item)) {
            onRemoveSelectedItem(item);
            return;
        }
        if (selectionLimit === selectedValues.length) {
            return;
        }
        selectedValues.push(item);
        onSelect(selectedValues, item);
        setSelectedValues(selectedValues, () => {
            if (!showCheckbox) {
                removeSelectedValuesFromOptions(true);
            } else {
                filterOptionsByInput();
            }
        });
        if (!props.closeOnSelect) {
            searchBox.current.focus();
        }
    }

    const fadeOutSelection = (item) => {
        const {selectionLimit, showCheckbox, singleSelect} = props;
        if (singleSelect) {
            return;
        }
        if (selectionLimit === -1) {
            return false;
        }
        if (selectionLimit !== selectedValues.length) {
            return false;
        }
        if (selectionLimit === selectedValues.length) {
            if (!showCheckbox) {
                return true;
            } else {
                if (isSelectedValue(item)) {
                    return false;
                }
                return true;
            }
        }
    }

    const isDisablePreSelectedValues = (value) => {
        const {isObject, disablePreSelectedValues, displayValue} = props;
        if (!disablePreSelectedValues || !preSelectedValues.length) {
            return false;
        }
        if (isObject) {
            return (
                preSelectedValues.filter(i => i[displayValue] === value[displayValue])
                    .length > 0
            );
        }
        return preSelectedValues.filter(i => i === value).length > 0;
    }

    const renderNormalOption = () => {
        const {isObject = false, displayValue, showCheckbox, style, singleSelect} = props;
        return options.map((option, i) => (
            <li
                key={`option${i}`}
                style={style['option']}
                className={`
              ${highlightOption === i ? `highlightOption highlight` : ""} 
              ${fadeOutSelection(option) && 'disableSelection'} 
              ${isDisablePreSelectedValues(option) && 'disableSelection'} option
            `}
                onClick={() => onSelectItem(option)}
            >
                {showCheckbox && !singleSelect && (
                    <input
                        type="checkbox"
                        readOnly
                        className={`checkbox`}
                        checked={isSelectedValue(option)}
                    />
                )}
                {isObject ? option[displayValue] : (option || '').toString()}
            </li>
        ));
    }

    const renderGroupByOptions = () => {
        const {isObject = false, displayValue, showCheckbox, style, singleSelect} = props;
        return Object.keys(groupedObject).map(obj => {
            return (
                <React.Fragment key={obj}>
                    <li className="groupHeading" style={style['groupHeading']}>{obj}</li>
                    {groupedObject[obj].map((option, i) => (
                        <li
                            key={`option${i}`}
                            style={style['option']}
                            className={`
               groupChildEle ${fadeOutSelection(option) && 'disableSelection'}
                ${isDisablePreSelectedValues(option) && 'disableSelection'} option
              `}
                            onClick={() => onSelectItem(option)}
                        >
                            {showCheckbox && !singleSelect && (
                                <input
                                    type="checkbox"
                                    className={'checkbox'}
                                    readOnly
                                    checked={isSelectedValue(option)}
                                />
                            )}
                            {isObject ? option[displayValue] : (option || '').toString()}
                        </li>
                    ))}
                </React.Fragment>
            )
        });
    }

    const renderOptionList = () => {
        const {groupBy, style, emptyRecordMsg, loading, loadingMessage = 'loading...'} = props;
        if (loading) {
            return (
                <ul className={`optionContainer`} style={style['optionContainer']}>
                    {typeof loadingMessage === 'string' &&
                    <span style={style['loadingMessage']} className={`notFound`}>{loadingMessage}</span>}
                    {typeof loadingMessage !== 'string' && loadingMessage}
                </ul>
            );
        }
        return (
            <ul className={`optionContainer`} style={style['optionContainer']}>
                {options.length === 0 && <span style={style['notFound']} className={`notFound`}>{emptyRecordMsg}</span>}
                {!groupBy ? renderNormalOption() : renderGroupByOptions()}
            </ul>
        );
    }


    const renderSelectedList = () => {
        const {isObject = false, displayValue, style, singleSelect, customCloseIcon} = props;
        return selectedValues.map((value, index) => (
            <span
                className={`chip  ${singleSelect && 'singleChip'} ${isDisablePreSelectedValues(value) && 'disableSelection'}`}
                key={index} style={style['chips']}>
        {!isObject ? (value || '').toString() : value[displayValue]}
                {!isDisablePreSelectedValues(value) && (!customCloseIcon ? <img
                        className="icon_cancel closeIcon"
                        src={closeIconType}
                        onClick={() => onRemoveSelectedItem(value)}
                    /> :
                    <i className="custom-close" onClick={() => onRemoveSelectedItem(value)}>{customCloseIcon}</i>)}
      </span>
        ));
    }


    const toggelOptionList = () => {
        setToggleOptionsList(prev => !prev);
        setHighlightOption(prev => props.avoidHighlightFirstOption ? -1 : 0);
    }

    const onFocus = () => {
        if (toggleOptionsList) {
            setOptionTimeout(null);
        } else {
            toggelOptionList();
        }
    }

    const onBlur = () => {
        setOptionTimeout(setTimeout(toggelOptionList, 250));
    }

    const isVisible = (elem) => {
        return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }

    const hideOnClickOutside = () => {
        const element = document.getElementsByClassName('multiselect-container')[0];
        const outsideClickListener = event => {
            if (element && !element.contains(event.target) && isVisible(element)) {
                toggelOptionList();
            }
        }
        document.addEventListener('click', outsideClickListener)
    }

    const renderMultiselectContainer = () => {
        const {placeholder, style, singleSelect, id, hidePlaceholder, disable, showArrow} = props;
        return (
            <div className={`multiselect-container multiSelectContainer ${disable ? `disable_ms` : ''}`}
                 id={id || 'multiselectContainerReact'} style={style['multiselectContainer']}>
                <div className={`search-wrapper searchWrapper ${singleSelect ? 'singleSelect' : ''}`}
                     ref={searchWrapper} style={style['searchBox']}
                     onClick={singleSelect ? toggelOptionList : () => {
                     }}
                >
                    {renderSelectedList()}
                    <input
                        type="text"
                        ref={searchBox}
                        className="searchBox"
                        id={`${id || 'search'}_input`}
                        onChange={onChange}
                        value={inputValue}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={((singleSelect && selectedValues.length) || (hidePlaceholder && selectedValues.length)) ? '' : placeholder}
                        onKeyDown={onArrowKeyNavigation}
                        style={style['inputField']}
                        autoComplete="off"
                        disabled={singleSelect || disable}
                    />
                    {(singleSelect || showArrow) && <img
                        src={DownArrow}
                        className={`icon_cancel icon_down_dir`}
                    />}
                </div>
                <div
                    className={`optionListContainer ${
                        toggleOptionsList ? 'displayBlock' : 'displayNone'
                    }`}
                >
                    {renderOptionList()}
                </div>
            </div>
        );
    }

    return renderMultiselectContainer();
}

export default Multiselect;


// TODO : Default props is deprecated
Multiselect.defaultProps = {
    options: [],
    disablePreSelectedValues: false,
    selectedValues: [],
    isObject: true,
    displayValue: "model",
    showCheckbox: false,
    selectionLimit: -1,
    placeholder: "MultiSelect",
    groupBy: "",
    style: {},
    emptyRecordMsg: "No Options Available",
    onSelect: () => {
    },
    onRemove: () => {
    },
    closeIcon: 'circle2',
    singleSelect: false,
    caseSensitiveSearch: false,
    id: '',
    closeOnSelect: true,
    avoidHighlightFirstOption: false,
    hidePlaceholder: false,
    showArrow: false,
    keepSearchTerm: false,
    customCloseIcon: ''
};