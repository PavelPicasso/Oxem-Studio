import './CardItem.scss';
import React, { useEffect, useState } from "react";

type CardItemState = {
    value: number;
    percent: number;
    typeOfFocused: string;
    percentFocused: boolean;
};

type CardItemProps = {
    min: number;
    max: number;
    step: number;
    title: string;
    after: string;
    currentValue: number;
    handleUpdateValue?: any;
};

export const CardItem: React.FC<CardItemProps> = ({min, max, step, title, after, currentValue, handleUpdateValue}) => {    
    const initPercent = after === 'input'? (Math.round((max - min) / 2) + min) : 35;
    const initValue = after === 'input'? ((currentValue * initPercent) / 100) : currentValue;

    const initialState = {
        value: initValue,
        percent: initPercent,
        typeOfFocused: 'text',
        percentFocused: false
    };

    const [card, setCard] = useState<CardItemState>(initialState);

    useEffect(() => {
        if (after === 'input') {
            setCard({...card, value: ((currentValue * card.percent) / 100)});
        }
    }, [currentValue, card.percent]);

    const uniqueId = (prefix = 'id-'): string => {
        return prefix + Math.random().toString(16).slice(-4);
    }

    const handleChangeInputRange = (value: number) => {
        if (after === 'input') {
            setCard({...card, value: (currentValue * value) / 100, percent: value});

            handleUpdateValue(card.value);
        }

        if (after === '₽') {
            setCard({...card, value: value});

            handleUpdateValue(value, (currentValue * card.percent) / 100);
        } 

        if (after === 'мес.') {
            setCard({...card, value: value});

            handleUpdateValue(value);
        }
    }

    const updateInputValuePer = (value: number) => {
        if (after === 'input') {
            const per = Math.round((Number(value) * 100) / currentValue);
            const perMoney = (currentValue * per) / 100;
            
            setCard({...card, percent: per, value: perMoney});
            
            handleUpdateValue(perMoney);
        } 

        if (after === '₽') {
            setCard({...card, value: value});

            handleUpdateValue(value, (currentValue * card.percent) / 100);
        } 

        if (after === 'мес.') {
            setCard({...card, value: value});

            handleUpdateValue(value);
        }
    }

    const prettyfy = (num: number) => {
        const separator = " ";
        return num.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + separator);
    };

    const checkPrettyfyValue = () => {
        return card.typeOfFocused === 'text' ? prettyfy(card.value) : card.value;
    }

    const checkPrettyfyPercent = () => {
        return !card.percentFocused ? card.percent.toString() + ' %' : card.percent;
    }

    const setMinValue = (min: number) => {
        return after !== 'input'? min: (currentValue * min) / 100;
    }

    const setMaxValue = (max: number) => {
        return after !== 'input'? max: (currentValue * max) / 100;
    }

    const checkExtreme = (value: number) => {
        if (after === 'input') {
            
        } 

        if (after === '₽') {
            if (value > max) {
                setCard({...card, value: 1});
            } else {
                if (value < min) {
                    setCard({...card, value: min});
                } else {
                    setCard({...card, value: value});
                }
            }
        } 

        if (after === 'мес.') {

        }
    }

    const id = uniqueId('myprefix-');

    return (
        <div className='calculation-item'>
            <label htmlFor={id} className={'title'}>{title}</label>

            <div className={card.percentFocused? 'container paint' : 'container'}>
                <div className="input">
                    <input
                        type={card.typeOfFocused}
                        id={id}
                        className='input__financial'
                        min={setMinValue(min)}
                        max={setMaxValue(max)}
                        value={checkPrettyfyValue()}
                        onFocus={e => {setCard({...card, typeOfFocused: 'number'})}}
                        onBlur={e => {setCard({...card, typeOfFocused: 'text'})}}
                        onChange={e => {updateInputValuePer(Number(e.target.value))}}
                    />

                    {after === 'input'? (
                        <input
                            type={!card.percentFocused ? 'text' : 'number'}
                            className='input__percent'
                            min={min}
                            max={max}
                            value={checkPrettyfyPercent()}
                            onFocus={e => {setCard({...card, percentFocused: true})}}
                            onBlur={e => {setCard({...card, percentFocused: false})}}
                            onChange={e => {
                                    setCard({...card, percent: Number(e.target.value)});

                                    handleUpdateValue(Number(e.target.value));
                                }
                            }
                        />
                    ) : (
                        <span className='input__after'>
                            {after}
                        </span>
                    )}
                </div>

                <input
                    type="range"
                    className='input__range'
                    min={min}
                    max={max}
                    step={step}
                    value={after === 'input'? card.percent : card.value}
                    onChange={(e) => handleChangeInputRange(Number(e.target.value))}
                />
            </div>
        </div>
    )
};