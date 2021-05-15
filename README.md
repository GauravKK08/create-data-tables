# create-data-tables
Parses data from API response and creates data-tables to filter,view,search etc.

Sample API Response used to build the data table.

{'books' : [        {               'id' : 1,            'name' : 'Da Vinci Code',            'author' : 'Dan Brown',            'published_year' : 2003        },        {               'id' : 2,            'name' : 'Digital Fortress',            'author' : 'Dan Brown',            'published_year' : 1998        },        {            'id' : 3,            'name' : 'Catcher in the Rye',            'author' : 'J D Salinger',            'published_year' : 1951        }    ]}

Rules:
1. 'id' column is only to be used as identifier and not to be displayed.
2. Filtering can be done on any of the columns, but only one at a time.
3. sorting should be available on all the columns. Only one column can be sortedat a time.
4. Clicking on the header should reverse the sorting order if click on already sorted column.
5. Clicking on the header should sort in ascending order if clicked on an  unsorted column.
