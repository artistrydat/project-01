import React from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import type { ListProps } from '~/types/ui.types';

export default function List<T>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  onRefresh,
  refreshing = false,
  emptyText = 'No items found',
  HeaderComponent,
  FooterComponent,
  ListItemSeparator,
  ...rest
}: ListProps<T>) {
  // Empty state component
  const EmptyComponent = () => (
    <View className="flex-1 justify-center items-center py-12">
      <Text className="text-quaternary text-center">{emptyText}</Text>
    </View>
  );

  // Define ItemSeparatorComponent as a function that returns the separator element
  const ItemSeparatorComponent = ListItemSeparator 
    ? () => ListItemSeparator 
    : undefined;

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={keyExtractor}
      ListHeaderComponent={HeaderComponent || undefined}
      ListFooterComponent={FooterComponent || undefined}
      ListEmptyComponent={!loading ? EmptyComponent : null}
      ItemSeparatorComponent={ItemSeparatorComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        { flexGrow: 1 },
        data.length === 0 && { justifyContent: 'center' },
      ]}
      {...rest}
    />
  );
}
