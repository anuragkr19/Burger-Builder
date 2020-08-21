import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    //convert object of key values into array values 
    let transformedIngredients =  Object.keys(props.ingredients)
                                        .map(ingKey => {
                       return [...Array(props.ingredients[ingKey])].map((_,index)=>{
                       return <BurgerIngredient key={ingKey + index} type={ingKey} />
                   })
                })
       .reduce((arr,el)=> {
                        /**
                        * bulitin arrrow function which transforms an array into other thing
                        */
        return arr.concat(el);
        //here ingKey => 'salad','cheese','bacon' etc, index:- array index
                   //here array is ['salad','salad'], ['bacon','bacon','bacon']
    })


    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please add more ingredients!</p>;
    }  

     return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
              {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
     );
};


export default burger;