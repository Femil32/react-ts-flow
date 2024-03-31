import { useAppSelector } from '@/redux/hooks';
import React, { useState } from 'react';
import { Table, Column, SortDirection, AutoSizer, SortDirectionType } from 'react-virtualized';
import 'react-virtualized/styles.css'; // import the styles


interface data {
  data: any[],
  columns: string[],
}

const VirtualizedTable = (props: data) => {
  // const {
  //   data,
  //   columns
  // } = props

  const { fileData } = useAppSelector(state => ({
    fileData: state.fileData
  }))

  const { inputColumns, inputData } = fileData


  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.ASC);

  const sortedList = () => {
    const formatedData = []

    for (let i = 0; i < inputData.length; i++) {
      let rowData = inputData[i];
      let rowObject = {};

      for (let j = 0; j < inputColumns.length; j++) {
        let header = inputColumns[j];
        let data = rowData[j];
        rowObject[header] = data;
      }

      formatedData.push(rowObject);
    }

    const sorted = [...formatedData].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });

    return sortDirection === SortDirection.ASC ? sorted.reverse() : sorted;
  };

  const sort = ({ sortBy, sortDirection }: {
    sortBy: string, sortDirection: SortDirectionType
  }) => {
    setSortBy(sortBy);
    setSortDirection(sortDirection);
  };


  return (
    <AutoSizer>
      {({ width, height }) => (
        <Table
          width={width}
          height={height}
          headerHeight={20}
          rowHeight={30}
          rowCount={inputData.length}
          rowGetter={({ index }) => sortedList()[index]}
          sort={sort}
          sortBy={sortBy}
          sortDirection={sortDirection}
        >
          {
            inputColumns.map(column => {
              return <Column
                key={column}
                label={column}
                dataKey={column}
                width={200}
                headerClassName='flex'
              />
            })
          }
        </Table>
      )}
    </AutoSizer>
  );
};

export default VirtualizedTable;
