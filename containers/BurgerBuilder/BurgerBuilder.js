import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES ={
     salad:0.5,
     cheese:0.4,
     meat:1.3,
     bacon:0.7
}

class BurgerBuilder extends Component{


 

    state ={
        ingredients:null,
        totalPrice:4,
        purchaseble:false,
        purchasing:false,
        loading:false,
        error: false
    }

    componentDidMount(){
        axios.get('https://reactburger-4b897.firebaseio.com/ingredients.json')
             .then(res => {
               this.setState({ingredients: res.data});
             })
             .catch(err => {
               this.setState({error: true});
             });
    }

    addIngredientHandler = (type) => {
           const oldCount = this.state.ingredients[type];
           const updatedCount = oldCount + 1;
           //state to be udpated in immutable way
           const updatedIngredients  = {
                ...this.state.ingredients
           };

           updatedIngredients[type] = updatedCount;
           const priceAddition = INGREDIENT_PRICES[type];
           const oldPrice = this.state.totalPrice;
           const newPrice = oldPrice + priceAddition;

           this.setState({totalPrice:newPrice,ingredients:updatedIngredients});

           this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceRemoval = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceRemoval;

        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    updatePurchaseState (ingredients){
      
        const sum = Object.keys(ingredients)
                          .map(key =>{
                              return ingredients[key] 
                              //return value of salad,bacon etc
                          })
                          .reduce((sum,el)=>{
                              return sum + el;  
                              //add total count of ingredients
                          },0);
                          
        this.setState({purchaseble: sum >0});
    }

    //handle click event of OrderNow button
    purchaseHandler = () => {
        //using arrow function context of this  is preserved
        this.setState({purchasing:true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = () => {

        this.setState({loading:true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "Anurag",
                address: "366 Avenue",
                country:"US"
            },
            email:"test_abc@test.com"
        }

        //for firebase the end point should be configured as below
        //end path become https://reactburger-4b897.firebaseio.com/orders.json

        axios.post('/orders.json',order)
            .then(resp => {
                this.setState({loading:false,purchasing:false});
            })
            .catch(err => {
                this.setState({loading:false,purchasing:false});
            });           
    }


  render(){

      const disabledInfo = {
          ...this.state.ingredients
      };
      
      for(let key in disabledInfo){
             disabledInfo[key] = disabledInfo[key] <=0; 
      }
      
      let orderSummary = null;
      let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />;

      if(this.state.ingredients){
        burger =  (<Aux><Burger ingredients={this.state.ingredients} />
            <BuildControls 
                  ingredientAdded={this.addIngredientHandler}
                  ingredientRemoved ={this.removeIngredientHandler}
                  disabled ={disabledInfo}
                  ordered = {this.purchaseHandler}
                  purchaseble={this.state.purchaseble}
                  price ={this.state.totalPrice}
            /></Aux>);

        orderSummary = <OrderSummary 
                           ingredients={this.state.ingredients}
                           price={this.state.totalPrice}
                           purchaseCancelled={this.purchaseCancelHandler}
                           purchaseContinue={this.purchaseContinueHandler}
            />;
            if(this.state.loading){
                orderSummary = <Spinner />;
            }
      }


    
      //disabledInfo:- salad:true,bacon:true

      return(
          <Aux>
              <Modal show={this.state.purchasing} 
                     modalClosed={this.purchaseCancelHandler}>
                  {orderSummary}
              </Modal>
              {burger}
          </Aux>
      );
  }
}

export default withErrorHandler(BurgerBuilder,axios);