document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfoDiv = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const tabsContainer = document.getElementById('tabs-container');
    const inventoryContainer = document.getElementById('inventory-container');
    const compareSlot1 = document.getElementById('compare-slot-1');
    const compareSlot2 = document.getElementById('compare-slot-2');
    const comparisonResults = document.getElementById('comparison-results');

    let loggedIn = false; // Track login state
    let selectedItem1 = null;
    let selectedItem2 = null;
    let characterTabs = [];  // To store fetched character data

    // --- Hardcoded Data and Mock Functions ---

    function simulateOAuthLogin() {
        loggedIn = true;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userInfoDiv.style.display = 'block';
        userNameSpan.textContent = "MyMockUser"; // Hardcoded username
        fetchCharacterTabs(); // Still call this, but it will use hardcoded tabs too
    }


    async function fetchCharacterTabs() {
      characterTabs = [
        { name: "MockCharacter1", league: "Standard" },
        { name: "MockCharacter2", league: "Hardcore" },
        { name: "Stash", league: "stash"}
      ];
      renderTabs();
    }

    async function fetchInventory(tabName) {
        // HARDCODED DATA instead of a real API call
        let inventoryData = [];

        if(tabName === 'Standard'){
            inventoryData = [
            { name: "Kaom's Heart", league: tabName, x: 0, y: 0, inventoryId: "A" },
            { name: "Shavronne's Wrappings", league: tabName, x: 2, y: 1, inventoryId: "B" },
            ];
        }
        else if (tabName === 'Hardcore'){
            inventoryData = [
            { name: "Headhunter", league: tabName, x: 1, y: 3 , inventoryId: "C" },
            ];
        }
         else if (tabName === 'stash'){
            inventoryData = [
              { name: "Mirror of Kalandra", league: tabName, x: 3, y: 5 , inventoryId: "D" },
            ];
        }

        renderInventory(inventoryData, tabName);
        return; // Important: return from the async function
    }

      async function fetchItemDetails(inventoryId, league) {
        // HARDCODED ITEM DETAILS
        let itemDetails = {};

        if (inventoryId === "A") {
            itemDetails = {
                name: "Kaom's Heart",
                league: league,
                typeLine: "Glorious Plate",
                inventoryId: inventoryId,
                properties: [
                    { name: "Quality", values: [["+20%", 1]] },
                    { name: "Level", values: [["79", 0]] },
                    { name: "Grants Level 20", values: [["Endurance Charge on Melee Stun Support",0]] }
                ],
                explicitMods: ["+500 to maximum Life"],
                inventoryId: inventoryId,
                icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb2R5QXJtb3Vycy9Cb2R5QXJtb3VyR29sZEV2aWwiLCJ3IjoxLCJoIjozLCJzY2FsZSI6MX1d/3174639152/BodyArmourGoldEvil.png", // Replace with your logic
            };
        } else if (inventoryId === "B") {
             itemDetails = {
                name: "Shavronne's Wrappings",
                league: league,
                typeLine:  "Occultist's Vestment",
                inventoryId: inventoryId,
                properties: [
                    { name: "Quality", values: [["+20%", 1]] },
                    { name: "Level", values: [["79", 0]] },
                ],
                explicitMods: ["+100 to maximum Life"],
                inventoryId: inventoryId,
                icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9Cb2R5QXJtb3Vycy9Cb2R5QXJtb3VySW50RW5lcmd5U2hpZWxkMSIsInciOjEsImgiOjMsInNjYWxlIjoxfV0/07cef0cdb5/BodyArmourIntEnergyShield1.png", // Replace with your logic
            };
        }
        else if (inventoryId === "C"){
            itemDetails = {
                name: "Headhunter",
                league: league,
                typeLine:  "Leather Belt",
                inventoryId: inventoryId,
                properties: [
                    { name: "Quality", values: [["+20%", 1]] },
                    { name: "Level", values: [["79", 0]] },
                ],
                explicitMods: ["Your hits inflict Spiked Concoction"],
                inventoryId: inventoryId,
                icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9CZWx0cy9CZWx0aGVhdnlVbmlxdWUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4760953338/BeltheavyUnique.png",
            };
        }
        else if (inventoryId === 'D'){
             itemDetails = {
                name: "Mirror of Kalandra",
                league: league,
                typeLine: "Currency",
                inventoryId: inventoryId,
                 properties: [],
                explicitMods: ["Double resources"],
                inventoryId: inventoryId,
                icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNaXJyb3IiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/62a963974f/CurrencyMirror.png", // Replace with your logic
            };
        }

        return itemDetails;
    }

    // --- Rendering Functions ---

   function renderTabs() {
        tabsContainer.innerHTML = ''; // Clear existing tabs
        characterTabs.forEach(tab => {
            const button = document.createElement('button');
            button.classList.add('tab-button');
            button.textContent = `${tab.name} (${tab.league})`;
            button.addEventListener('click', () => {
                fetchInventory(tab.league);
                setActiveTab(button);
            });
            tabsContainer.appendChild(button);
        });
        //set the first tab active by default
        if (characterTabs.length > 0) {
            fetchInventory(characterTabs[0].league); // Load first character's inventory by default
            setActiveTab(tabsContainer.firstChild);
        }
    }

    function setActiveTab(selectedButton) {
        // Remove 'active' class from all tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Add 'active' class to the selected tab button
        selectedButton.classList.add('active');
    }

    function renderInventory(items, tabName) {
        inventoryContainer.innerHTML = ''; // Clear existing items

        items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('item');
          // Use poe.ninja for icons, constructing the URL based on item name
          const iconUrl = item.icon ? item.icon :`https://www.poewiki.net/wiki/Special:Filepath/${item.name.replace(/ /g, '_')}.png`;

            //if the icon does not load, catch the error and fill it with a generic icon.
          const img = document.createElement('img');
            img.src = iconUrl;
            img.onerror = () => {
              img.src = "https://via.placeholder.com/50x50?text=No+Icon"; // Generic placeholder
            };
          itemDiv.appendChild(img);

          const nameSpan = document.createElement('span');
          nameSpan.classList.add('item-name');
          nameSpan.textContent = item.name;
          itemDiv.appendChild(nameSpan);

          // Tooltip (for item details)
          const tooltip = document.createElement('div');
          tooltip.classList.add('item-tooltip');
          // You'll populate the tooltip content when it's hovered, using fetchItemDetails
          itemDiv.appendChild(tooltip);

          // Comparison Logic
          itemDiv.addEventListener('click', async () => {
                const itemDetails = await fetchItemDetails(item.inventoryId, item.league);  // Fetch full details
                if (!selectedItem1) {
                    selectedItem1 = itemDetails;
                    populateCompareSlot(compareSlot1, selectedItem1);
                    compareItems();
                } else if (!selectedItem2) {
                    selectedItem2 = itemDetails;
                    populateCompareSlot(compareSlot2, selectedItem2);
                    compareItems();
                } // Optionally handle replacing an existing selection
            });

            itemDiv.addEventListener('mouseover', async () => {
              const itemDetails = await fetchItemDetails(item.inventoryId, item.league);
              showTooltip(tooltip, itemDetails);
            });

          inventoryContainer.appendChild(itemDiv);
      });
    }


    function showTooltip(tooltip, itemDetails) {
      tooltip.innerHTML = `
          <strong>${itemDetails.name}</strong><br>
          <em>${itemDetails.typeLine}</em><br>
          ${itemDetails.properties ? itemDetails.properties.map(prop => `${prop.name}: ${prop.values.map(v => v[0]).join(', ')}<br>`).join('') : ''}
          ${itemDetails.explicitMods ? itemDetails.explicitMods.map(mod => `${mod}<br>`).join('') : ''}
      `;
    }

    function populateCompareSlot(slot, item) {
        slot.innerHTML = ''; // Clear previous content

        const img = document.createElement('img');
        img.src = item.icon;
        img.onerror = () => {
          img.src = "https://via.placeholder.com/50x50?text=No+Icon";
        }
        slot.appendChild(img);

        const nameSpan = document.createElement('span');
        nameSpan
