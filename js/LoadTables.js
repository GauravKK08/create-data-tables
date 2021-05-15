table_app = (function()
{
	var get_configuration = function()
	{
		var url = "json/config.json";
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			init_tables(myArr);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	var init_tables = function(config)
	{
		var tables = config["tables"];
		for(var i=0;i<tables.length;i++)
		{
			load_table(tables[i]);
		}
	}

	var load_table = function(table_config)
	{
		var url = table_config["response_url"];
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				var resp_json = JSON.parse(xmlhttp.responseText);
				init_table(resp_json,"id");
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();			
	}
	
	var init_table = function (resp_json,hidden_column)
	{
		var books = resp_json["books"];
		var table=document.createElement("TABLE");

		var columns_list = new Array();
		var book0 = books[0];
		for(var prop in book0)
		{
			columns_list.push(prop);	
		}
		
		var hidden_column_pos = columns_list.indexOf(hidden_column);	
		
		for(var i=0;i<books.length;i++)
		{
			var row = table.insertRow(i);
			var k=0;
			for(var j=0;j<columns_list.length;j++)
			{	
				var cell = row.insertCell(k);
				cell.innerHTML = books[i][columns_list[j]];
				if(j==hidden_column_pos)
				{
					cell.classList.add("no_display");
				}
				k++;
			}
		}
		
		var header = table.createTHead();
		var row = header.insertRow(0);     
		for(var j=0;j<columns_list.length;j++)
		{	
			var th = document.createElement('th');
			th.innerHTML = columns_list[j];
			if(j==hidden_column_pos)
			{
				th.classList.add("no_display");
			}
			else
			{
				th.addEventListener('click',function(){return table_app.table_sort(this,hidden_column_pos)});
			}
			row.appendChild(th);
		}
		var div_elem = document.createElement("div");
		div_elem.classList.add("table_div");
		document.body.appendChild(div_elem);
		
		var filter_p = document.createElement("p");
		filter_p.classList.add("filter_bar")
		div_elem.appendChild(filter_p);
		
		var filter_span = document.createElement("span");
		filter_span.innerHTML = "Filter : "
		filter_p.appendChild(filter_span);
		
		var filter_select_box = document.createElement("select");
		filter_select_box.classList.add("filter_options");
		
		var option = document.createElement("option");
		option.text = "Select...";
		option.value=-1;
		filter_select_box.add(option);
			
		for(var i=0;i<columns_list.length;i++)
		{
			if(i==hidden_column_pos)
			{
				continue;
			}
			var option = document.createElement("option");
			option.text = columns_list[i];
			option.value=i;
			filter_select_box.add(option);
		}
		
		filter_p.appendChild(filter_select_box);
		
		var filter_ip_txt = document.createElement("input");
		filter_ip_txt.type="text";
		filter_ip_txt.placeholder="Enter Search term...";
		filter_ip_txt.classList.add("filter_ip_txt");
		filter_p.appendChild(filter_ip_txt);

		var filter_ip_btn = document.createElement("input");
		filter_ip_btn.type="button";
		filter_ip_btn.value="Filter";
		filter_ip_btn.classList.add("filter_ip_btn");
		filter_ip_btn.addEventListener('click',function(){return table_app.table_filter(this,hidden_column_pos)});
		filter_p.appendChild(filter_ip_btn);

		var filter_ip_reset_btn = document.createElement("input");
		filter_ip_reset_btn.type="button";
		filter_ip_reset_btn.value="Reset";
		filter_ip_reset_btn.classList.add("filter_ip_reset_btn");
		filter_ip_reset_btn.addEventListener('click',function(){return table_app.reset_filter(this)});
		filter_p.appendChild(filter_ip_reset_btn);
		
		div_elem.appendChild(table);
		
		var filter_result_text = document.createElement("p");
		filter_result_text.classList.add("filter_result_text");
		
		div_elem.appendChild(filter_result_text);
		div_elem.appendChild(document.createElement("br")); 
	}
	
	var sort_table = function(thead_element,hidden_column_pos) 
	{
		var cell_index_position = thead_element.cellIndex;
		var table_row_element = thead_element.parentElement;
		var table_head_element = table_row_element.parentElement;
		var thead_rows = table_head_element.rows;
		
		if(!thead_element.classList.contains("asc") && !thead_element.classList.contains("desc"))
		{
			thead_element.classList.add("asc");
			sort_order = "asc";
		}
		else 
		{
			if(thead_element.classList.contains("asc"))
			{
				thead_element.classList.remove("asc");
				thead_element.classList.add("desc");
				sort_order = "desc";
			}
			else
			{
				if(thead_element.classList.contains("desc"))
				{
					thead_element.classList.remove("desc");
					thead_element.classList.add("asc");
					sort_order = "asc";
				}
			}
		}
		
		for(var i=0;i<table_row_element.cells.length;i++)
		{
			if(i!=cell_index_position)
			{
				if(table_row_element.cells[i].classList.contains("asc") || table_row_element.cells[i].classList.contains("desc"))
				{
					table_row_element.cells[i].classList.remove("asc")
					table_row_element.cells[i].classList.remove("desc")
				}
			}
		}
		
		var table_element = table_head_element.parentElement;
		var table_div = table_element.parentElement;
		var tbody = table_element.tBodies[0];
		var hidden_row_ids = [];
		
		rows = tbody.rows;
		
		var array = new Array();
		for(var i=0;i<rows.length;i++)
		{
			var is_hidden_row = false;
			if(rows[i].classList.contains("no_display"))
			{
				is_hidden_row = true;
			}
			cells = rows[i].cells;
			array[i] = new Array();
			for(var j=0;j<cells.length;j++)
			{
				array[i][j] = cells[j].innerHTML;
			}
			if(is_hidden_row)
			{
				hidden_row_ids.push(array[i][hidden_column_pos]);
			}
		}
		
		if(sort_order == "asc")
		{
			array.sort(function(a,b){
				return (a[cell_index_position]==b[cell_index_position])?0:(a[cell_index_position]>b[cell_index_position]);
			});
		}
		if(sort_order == "desc")
		{
			array.sort(function(a,b){
				return (a[cell_index_position]==b[cell_index_position])?0:(a[cell_index_position]<b[cell_index_position]);
			});
		}

		var tr_string = "";

		for (var i=0;i<rows.length;i++)
		{
			var array_row = array[i];
			var add_as_hidden_row = false
			
			var td_string = "";
			for(var j=0;j<array_row.length;j++)
			{
				if(j == hidden_column_pos)
				{
					var td_elem = "<td class='no_display'>"+array_row[j]+"</td>";
					if(hidden_row_ids.indexOf(array_row[j].toString())!=-1)
					{
						add_as_hidden_row = true
					}
				}
				else
				{
					var td_elem = "<td>"+array_row[j]+"</td>";
				}
				td_string += td_elem;
			}
			if(add_as_hidden_row)
			{
				tr_string += "<tr class='no_display'>";
			}
			else
			{
				tr_string += "<tr>";
			}
			td_string+="</tr>";
			tr_string += td_string
		}
		tbody.innerHTML = tr_string;
	}
	
	var filter_table = function(filter_btn_elem,hidden_column_pos)
	{
		var filter_p_elm = filter_btn_elem.parentElement;
		var tbl_div_elm = filter_btn_elem.parentElement.parentElement;
		var filter_bar_elem = tbl_div_elm.getElementsByClassName("filter_bar")[0];
		var filter_bar_select_elem = filter_bar_elem.getElementsByClassName("filter_options")[0];
		var filtering_column_pos = filter_bar_select_elem[filter_bar_select_elem.selectedIndex].value;
		if(filtering_column_pos == -1)
		{
			alert("Please select a column to filter on.")
			return;
		}
		var tbl_elem = tbl_div_elm.getElementsByTagName("table")[0];
		var tbody=tbl_elem.tBodies[0];

		var rows = tbody.rows;
		var filtering_bar_input_txt = filter_bar_elem.getElementsByClassName("filter_ip_txt")[0];
		var filtering_value = filtering_bar_input_txt.value;
		var filtering_value_lower = filtering_value.toLowerCase().trim();
		var at_least_one_match = false;
		var filter_result_text = tbl_div_elm.getElementsByClassName("filter_result_text")[0];
		
		var filtered_rows_count = 0;
		var rows_length = rows.length;

		for(var j=0;j<rows_length;j++)
		{
			if(rows[j].classList.contains("no_display"))
			{
				rows[j].classList.remove("no_display");
			}
			var cell_value = rows[j].cells[filtering_column_pos].innerHTML;
			var cell_value_lower = cell_value.toLowerCase().trim();

			if(cell_value_lower.indexOf(filtering_value_lower)==-1)
			{
				rows[j].classList.add("no_display");
				filtered_rows_count++;
			}
			else
			{
				at_least_one_match = true;
			}
		}
		
		if(!at_least_one_match)
		{
			for(var k=0;k<rows.length;k++){rows[k].classList.remove("no_display");}
			filter_result_text.innerHTML = "Showing "+rows_length+" entries.";
			alert("No match could be found for the filter term.\nPlease check the value you have entered.");
		}
		else
		{
			filter_result_text.innerHTML = "Showing "+(rows_length - filtered_rows_count)+" entries (Filtered from "+rows_length+" total entries)";
		}
		rows_new = rows;		
	}
	
	var reset_filter = function(filter_reset_btn_elem)
	{
		var filter_p_elm = filter_reset_btn_elem.parentElement;
		var tbl_div_elm = filter_reset_btn_elem.parentElement.parentElement;
		var filter_bar_elem = tbl_div_elm.getElementsByClassName("filter_bar")[0];
		
		var tbl_elem = tbl_div_elm.getElementsByTagName("table")[0];
		var tbody=tbl_elem.tBodies[0];

		var rows = tbody.rows;
		var filter_bar_select_elem = filter_bar_elem.getElementsByClassName("filter_options")[0];
		var filtering_column_pos = filter_bar_select_elem[filter_bar_select_elem.selectedIndex].value;
		var filtering_bar_input_txt = filter_bar_elem.getElementsByClassName("filter_ip_txt")[0];
		
		var filter_result_text = tbl_div_elm.getElementsByClassName("filter_result_text")[0];

		for(var k=0;k<rows.length;k++){rows[k].classList.remove("no_display");}
		filtering_bar_input_txt.value = "";
		filter_result_text.innerHTML = "";
	}
	
	return {
		get_configuration:function(){
			return get_configuration();
		},
		table_sort:function(thead_element,hidden_column_pos){
			return sort_table(thead_element,hidden_column_pos);
		},
		table_filter:function(filter_btn_elem,hidden_column_pos){
			return filter_table(filter_btn_elem,hidden_column_pos);
		},
		reset_filter:function(filter_reset_btn_elem){
			return reset_filter(filter_reset_btn_elem);
		}
	}
})();

window.onload = function(){
	table_app.get_configuration();	
}