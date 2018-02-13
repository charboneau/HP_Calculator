
	/**
	
		NodeList to Array
			This converts a nodelist to an array.
			
				(NodeList) list - this is the list to be converted.
				
					array gets new array.
					
					Loop.
					Sentry is I.
					Starts at 0.
					Ends at length of list.
					Increments by 1.
					
						array pushes the Ith entry of list
						
					Return array
	
	**/
	
	function nodeListToArray(list)
	{
		
		var array = [];
		
		for(var i = 0;i < list.length;i++)
		{
			
			array.push(list[i]);
			
		}
		
		return array;
		
	}

	/**
	
		Theme Swap
			Changes the theme of the page.
			(Element) page - this is the given page.
			(String) newTheme - this is the theme to swap to.
			
				oldTheme gets page's old data-theme attribute.
				listOfElements get all elements inside of page's.
				Convert listOfElements from node list to array.
				Push page onto list of elements.
				Loop.
				Sentry is I.
				Starts at 0.
				Ends at length of listOfElements.
				Increments by 1.
				
					The ith entry of listOfElement's data-theme attribute gets newTheme.
					
					classes gets the ith entry of listOfElement's class attribute.
					
					If classes is not null,
					
						listOfClasses gets classes split by " ".
						
						Loop.
						Sentry is K.
						Starts at 0.
						Ends at length of listOfClassse.
						Increments by 1.
						
							The Kth entry of listOfClasses appends " ".
							The Kth entry of listOfClasses has "-"+oldTheme+" " replaced by "-"+newTheme+" "
							The Kth entry of listOfClasses has " " removed.
							
						classes gets listOfClasses joined by " "
						
						The ith entry of listOfElement's class attribute gets classes.
	
	**/
	
	function themeSwap(page,newTheme)
	{
		var oldTheme = page.getAttribute("data-theme");
		var listOfElements = page.getElementsByTagName("*");
		listOfElements = nodeListToArray(listOfElements);
		listOfElements.push(page);
		for(var i = 0;i < listOfElements.length;i++)
		{
			
			listOfElements[i].setAttribute("data-theme",newTheme);
			classes = listOfElements[i].getAttribute("class");
			if(classes != null)
			{
					
				listOfClasses = classes.split(" ");
				for(var k = 0;k < listOfClasses.length;k++)
				{
					
					
					listOfClasses[k] += " ";
					
					listOfClasses[k] = listOfClasses[k].replace("-"+oldTheme+" ","-"+newTheme+" ");
					listOfClasses[k] = listOfClasses[k].replace(" ","");
					
				}
				
				classes = listOfClasses.join(" ");
				listOfElements[i].setAttribute("class",classes);
			
			}
			
			
		}
		
		$(page).trigger("pageshow");
		
		
	}
	
	/**
	
		Save Slider Values
		
			Writes the given values to local storage.
	
	**/
	
	function saveSliderValues(HPIV,ATKIV,DEFIV,SPATKIV,SPDEFIV,SPEEDIV)
	{
		
		var IVs = [
		
			HPIV,
			ATKIV,
			DEFIV,
			SPATKIV,
			SPDEFIV,
			SPEEDIV
			
		];
		
		for(var i = 0;i < IVs.length;i++)
		{
			
			localStorage.setItem("IV"+i,IVs[i]);
			
		}
		
		localStorage.setItem("lastGen","gen-3");//This tells us the last generation choice the user made.
		
	}
	
	/**
	
		Save Gen 2 Slider Values
		
			Writes the given values to local storage.
	
	**/
	
	function saveGen2SliderValues(ATKDV,DEFDV,SPDV,SPEEDDV)
	{
		
		var DVs = [
		
			ATKDV,
			DEFDV,
			SPDV,
			SPEEDDV
			
		];
		
		for(var i = 0;i < DVs.length;i++)
		{
			
			localStorage.setItem("DV"+i,DVs[i]);
			
		}
		
		localStorage.setItem("lastGen","gen-2");//This tells us the last generation choice the user made.
		
	}
	
	/**
	
		Load Slider Values 
		
			Loads all the stored values for the slider form elements.
			
			Call the change sliders function.
	
	**/
	
	function loadSliderValues()
	{
		
		var numericalFields = document.getElementsByClassName("numerical");
		
		for(var i = 0;i < numericalFields.length;i++)
		{
			
			var inputs = numericalFields[i].getElementsByTagName("input");
			
			for(var k = 0;k < inputs.length;k++)
			{
				
				var keyword = "IV";
				
				if(inputs.length == 4)
				{

					keyword = "DV";
					
				}

				var value = localStorage.getItem(keyword+k);
				if(localStorage.getItem(keyword+i) != null) {
					inputs[k].value = value;
					inputs[k].click();
					var percent = value/inputs[k].getAttribute("max");
					$('[aria-labelledby="'+inputs[k].id+'-label"]').css("left",(percent*100)+"%");//A little workaround to get JQuery to do what I want.
				}
				
			}
			
		}
		
		var lastGen = localStorage.getItem("lastGen");
		
		var changeGenSelect = document.getElementById("game-choice");
		var options = changeGenSelect.getElementsByTagName("input");
		
		for(var i = 0;i < options.length;i++)
		{
			
			if(options[i].value == lastGen)
			{
				
				options[i].click();
				
			}
			
		}
		/**
			Because I used an OR here. I'll show that I know what I'm doing.
			DeMorgan's Law:
			
				!(A AND B) == !A OR !B
				!(A OR B) == !A AND !B
		
		**/
		if(lastGen == "gen-2" || lastGen == null)
		{
			
			onChangeSlidersGen2();
			
		}
		
	}
	
	/**
	
		Calculate HP Value
		
			This calculates the HP value used in HP type calculations.
			
				(HPIV%2 + 2*ATKIV%2 + 4*DEFIV%2 + 8*SPEEDIV%2 + 16*SPECIALATKIV%2 + 32*SPECIALDEFIV%2)
	
	**/
	
	function calculateHPValue(HPIV,ATKIV,DEFIV,SPEEDIV,SPATKIV,SPDEFIV)
	{
		
		var HPbit = HPIV%2;
		var ATKbit = ATKIV%2;
		var DEFbit = DEFIV%2;
		var SPEEDbit = SPEEDIV%2;
		var SPATKbit = SPATKIV%2;
		var SPDEFbit = SPDEFIV%2;
		return HPbit + ATKbit*2 + DEFbit*4 + SPEEDbit*8 + SPATKbit*16 + SPDEFbit*32;

	}
	
	/**
	
		Calculate HP Type
		
			TYPE_INDEX = FLOOR[(Calculate HP Value*15)/63]
			
			types is an array : [Fighting,Flying,Poison,Ground,Rock,Bug,Ghost,Steel,Fire,Water,Grass,Electric,Psychic,Ice,Dragon,Dark]
	
	**/
	
	var types = ["Fighting","Flying","Poison","Ground","Rock","Bug","Ghost","Steel","Fire","Water","Grass","Electric","Psychic","Ice","Dragon","Dark"];
		
	function calculateHPType(HPvalue)
	{
		
		var typeIndex = Math.floor((HPvalue*15)/63);
		var types = ["Fighting","Flying","Poison","Ground","Rock","Bug","Ghost","Steel","Fire","Water","Grass","Electric","Psychic","Ice","Dragon","Dark"];
		
		return types[typeIndex];
		
	}
	
	/**
	
		Calculate HP Type Gen2
		
			TypeIndex gets 4*ATKDEV%4 + DEFDV%4
			
			Return type at typeIndex.
	
	**/
	
	function calculateHPTypeGen2(ATKDV,DEFDV)
	{

		var typeIndex = 4*(ATKDV%4) + DEFDV%4

		return types[typeIndex];
		
	}
	
	
	/**
	
		Calculate HP Power Value
		
			I realized that what I thought was the same function was a slightly different function after testing.
			
			Basically, it's the same formula as Calculate HP Value; however, instead of taking the mod of 2. It's the mod of 4, and if the value is higher than one, it is reduced to 1.
	
	
	**/
	
	function calculateHPPowerValue(HPIV,ATKIV,DEFIV,SPEEDIV,SPATKIV,SPDEFIV)
	{
		
		var HPbit = HPIV%4;
		var ATKbit = ATKIV%4;
		var DEFbit = DEFIV%4;
		var SPEEDbit = SPEEDIV%4;
		var SPATKbit = SPATKIV%4;
		var SPDEFbit = SPDEFIV%4;
		
		var bits = [
		
			HPbit,
			ATKbit,
			DEFbit,
			SPEEDbit,
			SPATKbit,
			SPDEFbit
		
		];
		
		var returnValue = 0;
		
		for(var i = 0;i < bits.length;i++)
		{
			
			if(bits[i] > 1)
			{
				
				bits[i] = 1;
				
			}else
			{
				
				bits[i] = 0;
				
			}
			
			returnValue += bits[i]*(Math.pow(2,i));
			
		}
		
		return returnValue;

	}
	
	/**
	
		Calculate HP Power
		
			POWER = FLOOR[(Calculate HP Power Value*40)/63]+30
	
	**/
	
	function calculateHPPower(HPvalue)
	{
		
		return Math.floor((HPvalue*40)/63)+30;
		
	}
	
	/**
	
		Calculate HP Power Gen 2
		
			Take each DV.
			If it is less than eight, make it 0. Otherwise make it 1.
			Then,
			
			Power = FLOOR[(5*(SPDV+2*SPEEDDV+4*DEFDV+ATKDV*8) + SPDV%4)/2] + 31
	
	**/
	
	function calculateHPPowerGen2(SPDV,SPEEDDV,DEFDV,ATKDV)
	{
		
		var bits = [
		
			SPDV,
			SPEEDDV,
			DEFDV,
			ATKDV
		
		];
		
		var sum = 0;
		
		for(var i = 0;i < bits.length;i++)
		{
			
			if(bits[i] < 8)
			{
				
				bits[i] = 0;
				
			}
			else
			{
				
				bits[i] = 1;
				
			}
			
			sum += bits[i]*Math.pow(2,i);
			
		}
		
		return Math.floor((5*sum + SPDV%4)/2) + 31;
		
	}
	
	/**
	
		Display HP Output
			Displays the HP calculated.
	
			Output gets element with id output.
			
			TypeOutput gets element with id type-output.
			PowerOutput gets element with id power-output.
			
			InnerHTML of TypeOutput gets HP_type.
			TypeOutput's data-type attribute gets HP_type.
			InnerHTML of PowerOutput gets HP_power.
			If Output's data-complete attribute is not true,
			
				Output's data-complete attribute gets true.
	
	**/
	
	function displayHPOutput(HP_type,HP_power)
	{
		
		var output = document.getElementById("output");
		
		var typeOutput = document.getElementById("type-output");
		var powerOutput = document.getElementById("power-output");
		
		typeOutput.innerHTML = HP_type;
		typeOutput.setAttribute("data-type",HP_type);
		powerOutput.innerHTML = HP_power;
		
		if(output.getAttribute("data-complete") != "true")
		{
		
			output.setAttribute("data-complete","true");
		
		}
		
	}
	
	/**
	
		On change of NON-gen-2 sliders,
		
			HPIV gets value of element with id HP_IV
			ATKIV gets value of element with id ATK_IV
			DEFIV gets value of element with id DEF_IV
			SPATKIV gets value of element with id SPATK_IV
			SPDEFIV gets value of element with id SPDEF_IV
			SPEEDIV gets value of element with id SPEED_IV
			
			HP_value gets Calculate HP Value of all the things we just got.
			
			HP_Power_value gets Calculate HP Power Value of all the things we just got.
			
			HP_type gets Calculate HP Type.
			
			HP_power gets Calculate HP Power.
			
			Display Output.

	**/
	
	function onChangeSliders()
	{

		var HPIV = document.getElementById("HP_IV").value;
		var ATKIV = document.getElementById("ATK_IV").value;
		var DEFIV = document.getElementById("DEF_IV").value;
		var SPATKIV = document.getElementById("SPATK_IV").value;
		var SPDEFIV = document.getElementById("SPDEF_IV").value;
		var SPEEDIV = document.getElementById("SPEED_IV").value;
		
		saveSliderValues(HPIV,ATKIV,DEFIV,SPATKIV,SPDEFIV,SPEEDIV);
		
		var HP_value = calculateHPValue(HPIV,ATKIV,DEFIV,SPEEDIV,SPATKIV,SPDEFIV);
		var HP_power_value = calculateHPPowerValue(HPIV,ATKIV,DEFIV,SPEEDIV,SPATKIV,SPDEFIV);
		var HP_type = calculateHPType(HP_value);
		var HP_power = calculateHPPower(HP_power_value);
		
		displayHPOutput(HP_type,HP_power);
		
	}
	
	/**

		On change of gen-2 sliders,
		
			HPDV gets value of element with id HP_DV
			ATKDV gets value of element with id ATK_DV
			DEFDV gets value of element with id DEF_DV
			SPATKDV gets value of element with id SPATK_DV
			SPDEFDV gets value of element with id SPDEF_DV
			SPEEDDV gets value of element with id SPEED_DV
			
			HP_type gets CalculateHPTypeGen2
			
			HP_type gets CalculateHPPowerGen2
			
			Display Output.
		
		
	**/
	
	function onChangeSlidersGen2()
	{
		
		var ATKDV = document.getElementById("ATK_DV").value;
		var DEFDV = document.getElementById("DEF_DV").value;
		var SPDV = document.getElementById("SP_DV").value;
		var SPEEDDV = document.getElementById("SPEED_DV").value;
		
		saveGen2SliderValues(ATKDV,DEFDV,SPDV,SPEEDDV);
		
		var HP_type = calculateHPTypeGen2(ATKDV,DEFDV);
		
		var HP_power = calculateHPPowerGen2(SPDV,SPEEDDV,DEFDV,ATKDV);
		
		displayHPOutput(HP_type,HP_power);
		
	}
	
	/**
	
		On click of change theme button,
	
			page gets element with id "page1"
		
			newTheme gets value of caller.
			
			Save the theme in localStorage.
		
			Call Theme Swap with page and newTheme.
			
	**/
	

		function onChangeTheme()
		{
			
			var page = document.getElementById("page1");

			var newTheme = this.value;
			
			localStorage.setItem("theme",newTheme);
			
			themeSwap(page,newTheme);
			
		}
	
	/**

		On Change of Select field with ID of "game-choice",
		
			Generation gets the value of select field with ID of "game-choice"
			if Generation contains a dash,
				Generation gets everything after the dash in itself.
			If Generation is 2,
				Reset the sliders to the gen 2 settings.
			Else,
				Reset the sliders to the default settings.
			Body's data-generation-value gets Generation.
			
	**/
	
	function selectGeneration()
	{

		var generation = this.value;
		if(generation.indexOf("-") != -1)
		{
			
			generation = generation.split("-")[1];
			
		}
		if(generation == "2")
		{
			
			onChangeSlidersGen2();
			
		}
		else
		{
			
			onChangeSliders();
			
		}
		
		document.body.setAttribute("data-generation-value",generation);
		
	}
	
	/**
	
		On Numerical Mode/Iv Judge Switch changed,
		
			value gets value of switch.
			body's data-mode attribute gets value.
	
	**/
	
	function onModeChange()
	{
		
		var value = this.value;
		document.body.setAttribute("data-mode",value);
		
	}
	
	/**
	
		Onload of page,
			Set the slider's output.
			Tie selectGeneration to the change event of the element it links to.
			Tie onModeChange to the change event of the elements it links to.
			Tie onChangeTheme to the change event of the element it links to.
			Tie onChangeSliders to the change event of the element it links to.
			Set the theme to the one stored in localStorage if you can.
	
	**/
	function onload()
	{
		
		$("#game-choice input").change(selectGeneration);
		$('[name="mode"]').change(onModeChange);
		$('#change-theme input').change(onChangeTheme);
		$('.numerical.gen-3 input').change(onChangeSliders);
		$('.numerical.gen-2 input').change(onChangeSlidersGen2);
		loadSliderValues();
		if(localStorage.getItem("theme") != null)
		{
			
			var changeThemeSelect = document.getElementById("change-theme");
			var options = changeThemeSelect.getElementsByTagName("input");
			var theme = localStorage.getItem("theme");
			
			for(var i = 0;i < options.length;i++)
			{
				
				if(options[i].value == theme)
				{
					
					options[i].click();
					
				}
				
			}

		}
		
		
	}
	
	window.addEventListener("load",onload);
	
	