void bubbleSort(int arr[], int size)
{
    for (int j = 0; j < size - 1; ++j)
    {
        for (int i = 0; i < size - j - 1; ++i)
        {
            if (arr[i] > arr[i + 1])
            {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
        }
    }
}