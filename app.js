// Storage controller

const StorageCtrl = (function() {


    return {
        storeItem : function(item) {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromLS : function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemInLS : function(updatedItem) {
            items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(item.id === updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items)); 
        },
        deleteItemFromLS : function(id) {
            items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(item.id === id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items)); 
        },
        clearAllItemsFromLS : function() {
            localStorage.removeItem('items');
        }
    }
})();


// Item controller

const ItemCtrl = (function () {

    const Item = function(id, meal, calories) {
        this.id = id;
        this.meal = meal;
        this.calories = calories;
    }
    
    // Data structures
    let data = {
        items : StorageCtrl.getItemsFromLS(),
        currentItem : null,
        totalCalories : 0
    };

    return {
        getData : function() {
            return data;
        },
        // Set new input data into data structure
        setData : function(item) {
            item.id = data.items.length;
            const newItem = new Item(item.id, item.meal, item.calories);
            data.items.push(newItem);
            StorageCtrl.storeItem(newItem);
            ItemCtrl.setTotalCalories();
        },
        // Set the current item to the item to be edited
        setCurrentItem : function(id) {
            data.items.forEach((item) => {
                if(item.id === id) {
                    data.currentItem = item;
                }
            });
            return data.currentItem;
        },
        // Edit current item
        editCurrentData : function(item) {
            data.currentItem.meal = item.meal;
            data.currentItem.calories = item.calories;
            // Store update in LS
            StorageCtrl.updateItemInLS(data.currentItem);
            ItemCtrl.setTotalCalories();
        },
        removeCurrentItem : function() {
            // Delete from storage
            StorageCtrl.deleteItemFromLS(data.currentItem.id);
            data.items.splice(data.currentItem.id, 1);
            data.currentItem = null;
            
            ItemCtrl.setTotalCalories();
        },
        deleteAllItems : function() {
            data.items.splice(0,);
            data.currentItem = null;
            data.totalCalories = 0
        },
        setTotalCalories : function() {
            let total = 0;
            data.items.forEach((item) => {
                total += item.calories;
            });
            data.totalCalories = total
        }
        }
})();


// Event controller

const EventCtrl = (function() {

    return {
        listManager : function(e) {
            // Check if target is edit link
            if(e.target.parentNode.classList.contains('edit-item')) {
                
        
                // Get the id of current item
                const currentElementID = e.target.parentNode.parentNode.id;
                const currentElementIDArr = currentElementID.split('-');
                const currentItemID = parseInt(currentElementIDArr[1]);
                const currentItem = ItemCtrl.setCurrentItem(currentItemID);
        
                // Show the edit state
                UICtrl.showEditState(currentItem);
            }
        
            e.preventDefault();
        },
        addNewMeal : function(e) {
            //Update the list on user input
            App.updateList();
        
            e.preventDefault();
        },
        selectInput : function(e) {
            e.target.select();
        },
        updateItem : function(e) {
            App.updateCurrentItem();

            e.preventDefault();
        },
        goBack : function(e) {
            UICtrl.clearEditState();
            e.preventDefault();
        },
        deleteEvent : function(e) {
            App.deleteCurrentItem();
            e.preventDefault();
        },
        clearAllEvent : function(e) {
            App.clearAllItems();
            StorageCtrl.clearAllItemsFromLS();
            e.preventDefault();
        }
    }
})();



// UI controller

const UICtrl = (function () {
    const uiSelectors = {
        itemList : '.list-group',
        mealInput : '#meal',
        calorieInput : '#calories',
        totalCaloriesSpan : '#total-calories',
        hrSeperator : '#seperator',
        addBtn : '.btn-add',
        updateBtn : '.btn-update',
        deleteBtn : '.btn-delete',
        backBtn : '.btn-back',
        clearBtn : '.clear-btn'
    };

    return {
        // Get user input
        getInput : function() {
            const meal = document.querySelector(uiSelectors.mealInput).value,
                calories = parseFloat(document.querySelector(uiSelectors.calorieInput).value);

            return {
                meal,
                calories
            };
        },
        // Clear the input fields
        clearInput : function() {
            document.querySelector(uiSelectors.mealInput).value = '';
            document.querySelector(uiSelectors.calorieInput).value = '';
        },
        //Populate the list with items
        populateItems : function(data) {
            if(data.items.length === 0) {
                document.querySelector(uiSelectors.hrSeperator).style.display = 'none';
            } else {
                document.querySelector(uiSelectors.hrSeperator).style.display = 'block';
            }
            let output = '';
            data.items.forEach((item) => {
                output += `<li class="list-group-item" id = "item-${item.id}"><strong>${item.meal} :</strong> <em>${item.calories} Calories</em>
                <a href="#" class="float-right edit-item"><i class="fas fa-pen"></i></a>
            </li>`
            });

            document.querySelector(uiSelectors.itemList).innerHTML = output;
            document.querySelector(uiSelectors.totalCaloriesSpan).textContent = data.totalCalories;
        },
        // Show edit state
        showEditState : function(currentItem) {
            // Show current item details in input fields
            document.querySelector(uiSelectors.mealInput).value = currentItem.meal;
            document.querySelector(uiSelectors.calorieInput).value = currentItem.calories;

            // Show edit state buttons
            document.querySelector(uiSelectors.addBtn).style.display = 'none';
            document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
            document.querySelector(uiSelectors.backBtn).style.display = 'inline';

            // focus event listeners
            document.querySelector(uiSelectors.mealInput).addEventListener('focus', EventCtrl.selectInput);
            document.querySelector(uiSelectors.calorieInput).addEventListener('focus', EventCtrl.selectInput);
        },
        // Clear edit state
        clearEditState : function() {
            UICtrl.clearInput();
            document.querySelector(uiSelectors.addBtn).style.display = 'block';
            document.querySelector(uiSelectors.updateBtn).style.display = 'none';
            document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
            document.querySelector(uiSelectors.backBtn).style.display = 'none';
        },
        getSelectors : function() {
            return uiSelectors;
        }
    }
})();



// App controller

const App = (function () {
    
    return {
        loadEventListeners : function() {
            const uiSelectors = UICtrl.getSelectors();
            // Add button event listener
            document.querySelector(uiSelectors.addBtn).addEventListener('click', EventCtrl.addNewMeal);
            // Event listener on list for delegation
            document.querySelector(uiSelectors.itemList).addEventListener('click', EventCtrl.listManager);
            // Update button event listener
            document.querySelector(uiSelectors.updateBtn).addEventListener('click', EventCtrl.updateItem);
            // Back button event listener
            document.querySelector(uiSelectors.backBtn).addEventListener('click', EventCtrl.goBack);
            // Delete button event listener
            document.querySelector(uiSelectors.deleteBtn).addEventListener('click', EventCtrl.deleteEvent);
            // Clear all button event listener
            document.querySelector(uiSelectors.clearBtn).addEventListener('click', EventCtrl.clearAllEvent);
            // Disable submit on enter
            document.addEventListener('keypress', (e) => {
                if(e.keyCode === 13 || e.which === 13) {
                    e.preventDefault();
                }
            })
        },
        init : function() {
            // Load event listeners
            App.loadEventListeners();
            // Clear edit state
            UICtrl.clearEditState();
            ItemCtrl.setTotalCalories();
            const data = ItemCtrl.getData();
            UICtrl.populateItems(data);
        },
        updateList : function() {
            const item = UICtrl.getInput();
            UICtrl.clearInput();
            if(item.meal !== '' && item.calories !== '') {
                ItemCtrl.setData(item);
                const data = ItemCtrl.getData();
                UICtrl.populateItems(data);
            }
        },
        updateCurrentItem : function() {
            const item = UICtrl.getInput();
            if(item.meal !== '' && item.calories !== '') {
                ItemCtrl.editCurrentData(item);
                const data = ItemCtrl.getData();
                UICtrl.populateItems(data);
            }
            UICtrl.clearEditState();
        },
        deleteCurrentItem : function() {
            ItemCtrl.removeCurrentItem();
            const data = ItemCtrl.getData();
            UICtrl.populateItems(data);
            UICtrl.clearEditState();
        },
        clearAllItems : function() {
            const agreed = confirm('Are you sure?');
            if (agreed) {
                ItemCtrl.deleteAllItems();
                const data = ItemCtrl.getData();
                UICtrl.populateItems(data);
                UICtrl.clearEditState();
                document.querySelector('#seperator').style.display = 'none';
            }
        }
    }
})();

App.init();