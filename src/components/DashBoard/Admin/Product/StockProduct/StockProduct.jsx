import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import handlerFieldStock from './handlerFieldStock'
import styles from './StockProduct.module.css'
import Label from '../Components/Label/Label'
import Colors from '../Components/Filters/Colors/Colors'
import { useDispatch, useSelector } from 'react-redux';
import { fetchColors, fetchSizes } from '../../../../../redux/filters';
import Sizes from '../Components/Filters/Sizes/Sizes';
import handlerFilterStock from './handlerFilterStock';
import { ICONS } from '../../../../../const';

const initInfoStock = []

const StockProduct = ({ initStock, onChangeStockProduct, errors, model = '', gender = '' }) => {
    const dispatch = useDispatch()
    const [isHovered, setIsHovered] = useState({ 0: { minus: false, plus: false } })
    const [filtered, setFiltered] = useState([])
    const [stock, setStock] = useState(initInfoStock)
    const [filter, setFilter] = useState({ color: '', size: '' })
    const colors = useSelector(({ filters }) => filters.data.colors)
    const sizes = useSelector(({ filters }) => filters.data.sizes)

    useEffect(() => {
        setStock(initStock)
    }, [initStock, errors])

    useEffect(() => {
        dispatch(fetchColors())
        dispatch(fetchSizes(gender))
    }, [dispatch, gender])

    useEffect(() => {
        setStock(handlerFieldStock(colors, sizes))
    }, [dispatch, colors, sizes])

    useEffect(() => {
        setFiltered(handlerFilterStock(filter, stock))
    }, [filter, stock])


    const handlerChangeColor = (data) => {
        if (data === filter.color) {
            setFilter({ ...filter, color: '' })
        } else {
            setFilter({ ...filter, color: data })
        }
    }

    const handlerChangeSize = (data) => {
        if (data === filter.size) {
            setFilter({ ...filter, size: '' })
        } else {
            setFilter({ ...filter, size: data })
        }
    }
    const handlerChangeQuantity = (event, index) => {
        const { name, value } = event.target
        const newQuantity = 0
        isNaN(value)

        const updateData = [...stock, stock[index].quantity = value]
        setStock(updateData)
        // value >= 0 ? setStock(updateData) :
        //     value === null || value == undefined ? setStock(currentData) :
        //         null
    }

    const handlerClickQuantity = (index, button) => {
        let updateData = []
        if (button === 'minus' && stock[index].quantity > 0) {
            updateData = [...stock, stock[index].quantity -= 1]
            setStock(updateData)
        }
        if (button === 'plus') {
            updateData = [...stock, stock[index].quantity += 1]
            setStock(updateData)

        }
    }

    const handlerHoverEnter = (index, button) => {
        setIsHovered({ ...isHovered, [index]: { [button]: true } })
    }
    const handlerHoverLeave = (index, button) => {
        setIsHovered({ ...isHovered, [index]: { [button]: false } })
    }
    return (
        <div className={styles.StockContainer}>
            <div className={styles.ContainerHeader}>
                <div className={styles.ProductModel}>
                    <Label title='MODEL' text={model.toUpperCase()} />
                </div>
                <div className={styles.ProductFilters}>
                    <Label title='GENDER' text={gender.toUpperCase()} />
                    <Colors colors={colors} onSelectColor={handlerChangeColor} />
                    <Sizes sizes={sizes} onSelectSize={handlerChangeSize} />
                </div>
                <div className={styles.DataStock}>
                    {stock?.length && stock?.map(({ color, size, quantity }, index) => {
                        return (
                            filtered && filtered.includes(index) &&
                            <div className={styles.InfoStock} key={index}>
                                <div className={styles.SizeStock}>
                                    {size}
                                </div>
                                <div className={styles.ColorStock} style={{ background: `${color?.html}` }} title={color?.name}>
                                </div>
                                <div className={styles.QuantityStock}>
                                    <h4 onMouseEnter={() => handlerHoverEnter(index, "minus")}
                                        onMouseLeave={() => handlerHoverLeave(index, "minus")}
                                        onClick={() => handlerClickQuantity(index, "minus")}>
                                        {ICONS.MINUS(!isHovered[index]?.minus ? '#828282' : 'green')}</h4>
                                    <input type='number' name={index} value={quantity}
                                        className={styles.InputQuantity}
                                        onChange={(event) => handlerChangeQuantity(event, index)} />
                                    <h4 onMouseEnter={() => handlerHoverEnter(index, "plus")}
                                        onMouseLeave={() => handlerHoverLeave(index, "plus")}
                                        onClick={() => handlerClickQuantity(index, "plus")}>
                                        {ICONS.PLUS(!isHovered[index]?.plus ? '#828282' : 'green')}</h4>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

StockProduct.propTypes = {
    initStock: PropTypes.object,
    onChangeStockProduct: PropTypes.func,
    errors: PropTypes.object,
    model: PropTypes.string,
    gender: PropTypes.string,
}

export default StockProduct