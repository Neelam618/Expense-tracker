retrieveItemsFromLS();
calculateAmountSum();
setDefaultDateTodays();
       
document.getElementById('inputname').focus();
document.getElementById('addbtn').addEventListener('click', verifyAndAdd);
window.datatableInstance = $('#expenseTable').DataTable();        

function setDefaultDateTodays(){
    $('#datepicker').val(new Date().toISOString().slice(0,10));            //sets todays date default in date field 
}

function formatDate(dateString){
    let formattedDate = new Date(dateString).toLocaleDateString();    //new Date() gives current date object...convert obj into string
    return formattedDate;                 //in format dd/mm/yyyy
}

function addTableRow(){
    document.getElementById('tbody').appendChild(onAddBtnClick());    //adds table row in table element
    document.getElementById('inputname').value = "";
    document.getElementById('datepicker').value = "";
    document.getElementById('inputamount').value = "";
    document.getElementById('no-expenses').style.display = 'none';
    calculateAmountSum();   
    formatDate();
    setDefaultDateTodays();
}

function onAddBtnClick() {
    let expenseName = document.getElementById('inputname').value;
    let date = document.getElementById('datepicker').value;
    let amount = document.getElementById('inputamount').value; 
    return createTableRow(expenseName, date, amount, true);
}
        
function createTableRow(name, date, amount, storeInLS){
    //creates new tr tag in table element
    let newTableRow = document.createElement('tr');
    newTableRow.className = "tablerow"; 

    //creates new td tag in tr 
    let newTableData1 = document.createElement('td');
    newTableData1.className = "name";     //newTableData1.classList.add("name");
    newTableData1.innerText = name;

    let newTableData2 = document.createElement('td');
    newTableData2.className = "date";   
    newTableData2.innerText = formatDate(date);

    let newTableData3 = document.createElement('td');
    newTableData3.className = "amount";     
    newTableData3.innerText = amount;

    let newTableData4 = document.createElement('td');
    newTableData4.className = "deletebtn-td";
    let deleteBtn = document.createElement('button');
    deleteBtn.className = "deletebtn";  

    deleteBtn.id = 'deleteBtn' + document.getElementsByClassName('tablerow').length;;

    newTableData4.appendChild(deleteBtn);
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener('click', deleteRow);

    newTableRow.appendChild(newTableData1);
    newTableRow.appendChild(newTableData2);
    newTableRow.appendChild(newTableData3);
    newTableRow.appendChild(newTableData4);

    if (window.datatableInstance) {
        window.datatableInstance.row.add(newTableRow);     // tell data table to add row in our table element
    }

    if(storeInLS){         //if storeInLS is true
        storeItemsInLS(name, date, amount);
    }
    return newTableRow;
}

function verifyAndAdd(){
    let inputName = document.getElementById('inputname').value,
        inputDate = document.getElementById('datepicker').value,
        inputAmount = document.getElementById('inputamount').value,
        errorMsg = document.getElementById('error-msg');
    if(!inputName || !inputDate || !inputAmount){
        errorMsg.style.display = "block";
        document.getElementById('inputname').focus();
    }
    else {
        errorMsg.style.display = "none";
        document.getElementById('inputname').focus();
        addTableRow();
    }
}
        
function deleteRow(event){
    let rowToDelete = event.target.parentNode.parentNode;
    if (window.datatableInstance) {
        window.datatableInstance.row(rowToDelete).remove(); // tell datatable to remove a row
    }
    rowToDelete.remove();    // remove row
    
    let items = JSON.parse(localStorage.getItem('expenseItems')) || [];

    let indexToDelete = parseInt(event.target.id.replace('deleteBtn', ""));   //means eg. from id deleteBtn0 only 0 will stay 
    items.splice(indexToDelete, 1);                     //deletes 1 delete button element starting from indexToDelete
    localStorage.setItem("expenseItems", JSON.stringify(items));

    // to reassign ids to delete button element ( because id's sequence will be changed after deleting row other than last row)
    document.querySelectorAll("table .tablerow").forEach((row, index) => {
    row.getElementsByClassName("deletebtn")[0].id = "deleteBtn" + index;
    });
    
    if(!document.getElementsByClassName('tablerow')[0]){
        document.getElementById('no-expenses').style.display = 'block';
    }
    calculateAmountSum();
}

//click add button on keyboard enter
// Execute a function when the user releases a key on the keyboard
document.getElementById('inputamount').addEventListener("keyup", 
function(event) {            //you can also remove event parameter and it works
    // Number 13 is the "Enter" key on the keyboard
    if(event.keyCode === 13){                                   
        // Trigger the add button element with a click
        verifyAndAdd();
    }
});

function storeItemsInLS(name, date, amount){
    
    let obj = {
        name: name,
        date: date,
        amount: amount
    }
    //store row items
    let items = JSON.parse(localStorage.getItem('expenseItems')) || [];
    items.push(obj);
    localStorage.setItem("expenseItems", JSON.stringify(items));
}

function retrieveItemsFromLS(){
    let itemsfromLS = JSON.parse(localStorage.getItem('expenseItems'));
    let noExpensesAdded = document.getElementById('no-expenses');
    if (itemsfromLS && itemsfromLS.length > 0) {
        itemsfromLS.forEach((obj, index) => {
            document.getElementById('tbody').appendChild(createTableRow(obj.name, obj.date, obj.amount, false));
        });
    } 
    else{
        noExpensesAdded.style.display = "block";
    }
}

function calculateAmountSum(){
    let total = 0;
    document.querySelectorAll('table .tablerow .amount').forEach(item => {
    total = total + parseInt(item.textContent);
    });
    document.getElementById('totalamount').innerText = total;
}


