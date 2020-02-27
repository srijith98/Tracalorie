// Item controller
const ItemCtrl = (function () {

    const Item = function(id, meal, calories) {
        this.id = id;
        this.meal = meal;
        this.calories = calories;
    }
    
    // Data structures
    let data = {
        items : [],
        currentItem : null,
        totalCalories : 0
    };

    return {
        getItems : function() {
            return data.items;
        },
        setItems : function(item) {
            item.id = data.items.length;
            data.items.push(item);
        }
        }
})();


// UI controller
const UICtrl = (function () {
    const uiSelectors = {
        itemList : '.list-group',
        mealInput : '#meal',
        calorieInput : '#calories'
    };

    return {
        // Get user input
        getInput : function() {
            const mealInput = document.querySelector(uiSelectors.mealInput),
                caloriesInput = document.querySelector(uiSelectors.calorieInput);
            const meal = mealInput.value, calories = parseFloat(caloriesInput.value);
            mealInput.value = caloriesInput.value = '';
            return {
                meal,
                calories
            };
        },
        //Populate the list with items
        populateItems : function(items) {
            let output = '';
            items.forEach((item) => {
                output += `<li class="list-group-item" id = "item-${item.id}"><strong>${item.meal} :</strong> <em>${item.calories} Calories</em>
                <a href="#" class="float-right edit-item"><i class="fas fa-pen"></i></a>
            </li>`
            });

            document.querySelector(uiSelectors.itemList).innerHTML = output;
        }
    }
})();

// App controller
const App = (function (UICtrl, ItemCtrl) {
    
    return {
        init : function() {
            const items = ItemCtrl.getItems();
            UICtrl.populateItems(items);
        },
        updateList : function() {
            const item = UICtrl.getInput();
            ItemCtrl.setItems(item);
            const items = ItemCtrl.getItems();
            console.log(items);
            UICtrl.populateItems(items);
        }
    }
})(UICtrl, ItemCtrl);

App.init();

//Update the list on user input
document.querySelector('.btn-add').addEventListener('click', (e) => {
    App.updateList();

    e.preventDefault();
})

// Storage controller