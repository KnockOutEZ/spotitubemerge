import Image from "next/image";
import React, { useEffect, useState } from "react";

const PlaylistTable = ({ mergerPage, data, selectedItemsFunc }: any) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allItemNames = data.map((item: any) => item?.id);
      setSelectedItems(allItemNames);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const itemName = event.target.value;
    if (event.target.checked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemName]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((name) => name !== itemName)
      );
    }
  };

  useEffect(() => {
    console.log(selectedItems);
    selectedItemsFunc(selectedItems);
  }, [selectedItems]);

  return (
    <div className="relative overflow-x-auto overflow-y-auto max-h-[700px] shadow-lg sm:rounded-lg dark:shadow-blue-500/50">
      <table className="w-full text-sm text-left ">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-transparent">
          <tr>
            <th scope="col" className="p-4">
              {/* uncomment to add the select all input box */}
              {/* <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  onChange={handleSelectAll}
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div> */}
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Image</span>
            </th>
            <th scope="col" className="px-6 py-3">
            Playlist Name
            </th>
            {!mergerPage && (
              <>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Url
                </th>
              </>
            )}

            {/* <th scope="col" className="px-6 py-3">
              Action
            </th> */}
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((item: any, index: any) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50 dark:border-b-gray-700 dark:bg-transparent">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      value={item?.id}
                      checked={selectedItems.includes(item?.id)}
                      onChange={handleSelectItem}
                    />
                    <label
                      htmlFor={`checkbox-table-search-${index}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <td className="w-32">
                  <Image src={item?.images[0]?.url} alt="image" width={120} height={90} />
                </td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {item?.name}
                </td>
                {!mergerPage && (
                  <>
                    <td
                      className="px-6 py-4 text-ellipsis m-w-[300px]"
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></td>
                    <td className="px-6 py-4">
                      <a
                        href={item?.external_urls?.spotify}
                        className="text-blue-600 hover:underline"
                      >
                        {item?.external_urls?.spotify}
                      </a>
                    </td>
                  </>
                )}
                {/* <td className="flex items-center px-6 py-4 space-x-3 whitespace-nowrap">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 hover:underline"
                >
                  Remove
                </a>
              </td> */}
              </tr>
            ))
          ) : (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin mx-auto fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistTable;
