pragma solidity ^0.5.1;

contract Tests {

    struct Item
    {
        int256 id;
        string itemName;
        uint256 Price;
        uint256 Picture;
        string Location;
        address payable oAddress;
        address rAddress;
    }

    mapping(int256 => Item) public Items;

    int256 public ItemCount;

    function GetItemName(int256 id) public view returns (string memory)
    {
        return Items[id].itemName;
    }

    function GetItemPrice(int256 id) public view returns (int)
    {
        return int(Items[id].Price);
    }
    function GetItemLocation(int256 id) public view returns (string memory)
    {
        return Items[id].Location;
    }
    function GetItemPicture(int256 id) public view returns (int)
    {
        return int(Items[id].Picture);
    }

    function AddItem(string memory itemName, uint256 Price, string memory Location, uint256 Picture) public
    {
        ItemCount++;

        Item memory item = Item(ItemCount, itemName, Price, Picture, Location, msg.sender, address(0));

        Items[ItemCount] = item;

    }

    function UpdateName(int256 id, string memory newName) public returns (bool)
    {
        if (Items[id].oAddress != msg.sender)
        {
            return false;
        }

        Items[id].itemName = newName;

        return true;
    }

    function RemoveItem(int256 id) public returns (bool)
    {
        if (Items[id].oAddress != msg.sender)
        {
            return false;
        }

        delete Items[id];

        return true;
    }

    function BuyItem(int256 id) public payable
    {
        Item memory sellingItem = Items[id];

        if (sellingItem.oAddress == msg.sender)
        {
            return;
        }

        //payment
        sellingItem.oAddress.transfer(sellingItem.Price * 10**18);

        delete Items[id];

    }
}