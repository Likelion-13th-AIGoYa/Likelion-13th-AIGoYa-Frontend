import React from "react";
import styles from "../css/mainPopularMenu.module.css"


const popularMenus = [
    { id: 1, name: "Spicy Ramen", sales: 120 },
    { id: 2, name: "Margherita Pizza", sales: 95 },
    { id: 3, name: "Chicken Caesar Salad", sales: 80 }
];


function mainPopularMenu() {

    const { id, name, sales } = popularMenus;

    return (
        <div className={styles.section}>
            <div className="">
                <div>오늘의 인기 메뉴</div>
                <li>
                    <ul>
                        {popularMenus.map((menu) => (
                            <li key={menu.id}>
                                <span>{menu.id}</span> 
                            </li>        
                                                
                        ))}

                        
                    </ul>
                </li>

            </div>
        </div>
    )
}


export default mainPopularMenu