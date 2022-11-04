import './LeasingPage.scss';

import React, { useEffect, useState } from "react";
import { CardItem } from '../../component/CardItem/CardItem';
import { prettyfy } from '../../service/PrettifyTxt';

type CalculationState = {
    price: number;
    initialPayment: number;
    months: number;
    monthPay: number;
    amountContract : number;
};

export const LeasingPage: React.FC= () => {
    const initialState = {
        price: 3300000,
        initialPayment: 1155000,
        months: 30,
        monthPay: 116627,
        amountContract : 4653810
    };

    const [form, setForm] = useState<CalculationState>(initialState);

    useEffect(() => {
        setForm(state => ({...state, monthPay: Math.round((form.price - form.initialPayment) * ((0.035 * Math.pow((1 + 0.035), form.months)) / (Math.pow((1 + 0.035), form.months) - 1)))}));
    }, [form.price, form.initialPayment, form.months]);

    useEffect(() => {
        setForm(state => ({...state, amountContract : form.initialPayment + (form.months * form.monthPay)}));
    }, [form.monthPay, form.initialPayment, form.months]);

    const checkResultPayment = (payment: number) => {
        const initialPaymentMin = (form.price * 10) / 100;
        const initialPaymentMax = (form.price * 60) / 100;

        if (form.price >= 1000000 && form.price <= 6000000 && form.initialPayment >= initialPaymentMin && form.initialPayment <= initialPaymentMax && form.months >= 1 && form.months <= 60) {
            return prettyfy(payment);
        } else {
            return 'подсчет...';
        }
    }

    const sending = (e: any) => {
        e.preventDefault();

        console.log('Оформить заявку', form);
    }

    return (
        <form action="" className='calculation'>
            <h1>Рассчитайте стоимость автомобиля в лизинг</h1>
            
            <div className="calculation__options">
                <CardItem
                    title="Стоимость автомобиля"
                    min={1000000}
                    max={6000000}
                    step={10000}
                    after="&#8381;"
                    currentValue={form.price}
                    handleUpdateValue={(money: number, initPayment: number) => setForm({...form, price: money, initialPayment: initPayment})}
                />

                <CardItem
                    title="Первоначальный взнос"
                    min={10}
                    max={60}
                    step={1}
                    after="input"
                    currentValue={form.price}
                    handleUpdateValue={(initPayment: number) => setForm({...form, initialPayment: initPayment})}
                />

                <CardItem
                    title="Срок лизинга"
                    min={1}
                    max={60}
                    step={1}
                    after="мес."
                    currentValue={form.months}
                    handleUpdateValue={(mo: number) => setForm({...form, months: mo})}
                />
            </div>

            <div className="calculation__result">
                <div className='price'>
                    Сумма договора лизинга
                    <span className='payment'>{checkResultPayment(form.amountContract)} &#8381;</span>
                </div>

                <div className='price'>
                    Ежемесячный платеж от
                    <span className='payment'>{checkResultPayment(form.monthPay)} &#8381;</span>
                </div>

                <button className='btn' onClick={sending}>Оформить заявку</button>
            </div>
        </form>
    );
};