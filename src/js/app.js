App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    /*$.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });*/

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);

    return App.initContract();
  },


 
  initContract: function() {
          $.getJSON('Tests.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var TestsArtifact = data;
        App.contracts.Tests = TruffleContract(TestsArtifact);

        // Set the provider for our contract
        App.contracts.Tests.setProvider(App.web3Provider);

        // Use our contract to retrieve and mark the adopted pets
        return App.getAllItems();


      });



   return App.bindEvents();
  },
  getAllItems: function() {

    var Tests;
    console.log("bltt")
    App.contracts.Tests.deployed().then(function (instance) {

      Tests = instance;
      let cAccount = web3.currentProvider.selectedAddress;

      return Tests.addedItems({from:cAccount});

    }).then(async function (itemsIds) {

      var ids = itemsIds;
      var itemRow = $('#itemsToRentRow');
      var itemTemplate = $('#itemTemplate');
      console.log("isspausdink mane jei gali")

      for (var i = 0; i < ids.length; i++) {

        var id = ids[i].c[0]

        await Tests.GetItemName(id).then(function (result) {
          itemTemplate.find('.panel-title').text(result);
          return Tests.GetItemPrice(id);
        }).then(function (result) {
          itemTemplate.find('.rent-cost').text(result);
          return Tests.GetItemLocation(id);
        }).then(function (result) {
          itemTemplate.find('.item-location').text(result);
          return Tests.GetItemPicture(id);
        }).then(function (result) {
          console.log(result + "lol")
          if (result == 1)
            itemTemplate.find('img').attr('src', "images/tv.jpg");
          if (result == 2)
            itemTemplate.find('img').attr('src', "images/phone.jpeg");
          if (result == 3)
            itemTemplate.find('img').attr('src', "images/bike.jpg");
          if (result == 4)
            itemTemplate.find('img').attr('src', "images/box.png");

        }).then(function (){
          itemTemplate.find('.btn-buy').attr('data-id', id)
          itemRow.append(itemTemplate.html());
        })}
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.buyItems)

  },

  /*markAdopted: function() {
    var adoptionInstance;

App.contracts.Adoption.deployed().then(function(instance) {
  adoptionInstance = instance;

  return adoptionInstance.getAdopters.call();
}).then(function(adopters) {
  for (i = 0; i < adopters.length; i++) {
    if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.adopt(petId, {from: account});
  }).then(function(result) {
    return App.markAdopted();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  },*/

  addItems : function () {


    App.contracts.Tests.deployed().then(function(instance) {

      let itemName = document.getElementById("item")
      console.log(itemName.value)
      let itemPrice = parseInt(document.getElementById("cost").value)
      console.log(itemPrice)
      let itemLocation = document.getElementById("location")
      console.log(itemLocation.value);
      var itemtype = parseInt(document.getElementById("types").value)
      console.log(itemtype);
      let testsInstance = instance;
      let cAccount = web3.currentProvider.selectedAddress;
      return testsInstance.AddItem(itemName.value, itemPrice, itemLocation.value, itemtype, {from:cAccount});

    })

    App.getAllItems();
    App.timeout();
  },
  timeout : function () {

    setTimeout(function () {
      location.reload();
    }, 7000);

  },
  buyItems : function (event) {

    event.preventDefault();
    var testsInstance;
    var id;

    App.contracts.Tests.deployed().then(function(instance) {

      testsInstance = instance;

      id = parseInt($(event.target).data('id'));
      console.log(id);

      return testsInstance.GetItemPrice(id)
    }).then(function (result)
        {
          let cAccount = web3.currentProvider.selectedAddress;
          var price = result.c[0];
          console.log(price);
          return testsInstance.BuyItem(id, {value:price * 10**18, from:cAccount});
        });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});