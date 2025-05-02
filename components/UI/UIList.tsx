import { useAppTheme } from "@/context/theme-context";
import { useState } from "react";
import { Dimensions, Image, ImageSourcePropType, Modal, ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { SvgUri } from 'react-native-svg';
import WRText from "../wrappers/WRText";
import UIIcon from "./UIIcon";


export interface ListItem {
    label: string;
    value: string;
    description?: string;
    image?: ImageSourcePropType;
    icon?: React.ComponentProps<typeof UIIcon>['name'];
}

interface UIListProps {
    items: ListItem[];
    title?: string;
    placeholder?: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    showImages?: boolean;
    maxVisibleImages?: number;
    imageSize?: number;
    // Novas props para seleção múltipla
    selectable?: boolean;
    selectedValues?: string[];
    onSelectionChange?: (selectedValues: string[]) => void;
    selectAllByDefault?: boolean;
    minSelected?: number;
    maxSelected?: number;
    showSelectAll?: boolean;
}

interface ItemImageProps {
  image?: ImageSourcePropType;
  imageSize?: number;
  style?: any;
}

/**
 * Componente de listagem não selecionável que segue o padrão de design da aplicação
 * @param props Propriedades do componente
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UIList({
    items,
    title = "Lista",
    placeholder = "Ver itens",
    disabled = false,
    style,
    showImages = false,
    maxVisibleImages = 3,
    imageSize = 24,
    selectable = false,
    selectedValues = [],
    onSelectionChange,
    selectAllByDefault = false,
    minSelected = 0,
    maxSelected,
    showSelectAll = false
}: UIListProps) {
    const { theme } = useAppTheme();
    const [isOpen, setIsOpen] = useState(false);
    const modalHeight = Dimensions.get('window').height * 0.6;
    const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(
        selectAllByDefault ? items.map(item => item.value) : selectedValues || []
    );

    const currentSelectedValues = selectedValues || internalSelectedValues;

    const handleSelectionToggle = (value: string) => {
        if (!selectable) return;

        const isSelected = currentSelectedValues.includes(value);
        let newSelection: string[];

        if (isSelected) {
            // Verificar limite mínimo antes de desselecionar
            if (minSelected && currentSelectedValues.length <= minSelected) {
                return; // Não permite desselecionar se atingir o mínimo
            }
            newSelection = currentSelectedValues.filter(v => v !== value);
        } else {
            // Verificar limite máximo antes de selecionar
            if (maxSelected && currentSelectedValues.length >= maxSelected) {
                return; // Não permite selecionar se atingir o máximo
            }
            newSelection = [...currentSelectedValues, value];
        }

        if (onSelectionChange) {
            onSelectionChange(newSelection);
        } else {
            setInternalSelectedValues(newSelection);
        }
    };

    const handleSelectAll = () => {
        if (!selectable) return;
        const allValues = items.map(item => item.value);
        if (onSelectionChange) {
            onSelectionChange(allValues);
        } else {
            setInternalSelectedValues(allValues);
        }
    };

    const handleDeselectAll = () => {
        if (!selectable) return;
        const minSelection = minSelected ? items.slice(0, minSelected).map(item => item.value) : [];
        if (onSelectionChange) {
            onSelectionChange(minSelection);
        } else {
            setInternalSelectedValues(minSelection);
        }
    };

    const getDisplayText = () => {
        if (!selectable) return placeholder;
        
        const selectedCount = currentSelectedValues.length;
        if (selectedCount === 0) return "Nenhum item selecionado";
        if (selectedCount === 1) {
            const selectedItem = items.find(item => item.value === currentSelectedValues[0]);
            return selectedItem?.label || "1 item selecionado";
        }
        return `${selectedCount} itens selecionados`;
    };

    const ItemImage: React.FC<ItemImageProps> = ({ image, imageSize = 24, style }) => {
    // Verifica se é um objeto ImageURISource com URI
    if (image && typeof image === 'object' && !Array.isArray(image) && image.uri) {
        if (image.uri.endsWith('.svg')) {
        return (
            <SvgUri 
            width={imageSize}
            height={imageSize}
            uri={image.uri}
            style={[style]}
            onError={(error) => console.error('Erro ao carregar SVG:', error)}
            />
        );
        }
        return (
        <Image 
            source={{ uri: image.uri }}
            style={[{ width: imageSize, height: imageSize }]}
            resizeMode="cover"
            onError={(e) => console.log('Image error:', e.nativeEvent.error)}
        />
        );
    }

    // Caso seja um require (number) ou array
    return (
        <Image 
        source={image as any}
        style={[style, { width: imageSize, height: imageSize }]}
        />
    );
    };

    // Renderiza as imagens em miniatura no componente fechado
    const renderPreviewImages = () => {
        if (!showImages || items.length === 0) return null;

        const imagesToShow = items.slice(0, maxVisibleImages).filter(item => item.image);
        const remainingCount = items.filter(item => item.image).length - maxVisibleImages;

        return (
            <View style={styles.previewImagesContainer}>
                {imagesToShow.map((item, index) => (
                    <View key={index} style={[styles.previewImageWrapper, { marginLeft: index > 0 ? -8 : 0 }]}> 
                        <ItemImage 
                            image={item.image!}
                            style={[styles.previewImage, styles]}
                        />
                    </View>
                ))}
                {remainingCount > 0 && (
                    <View style={[styles.remainingCountContainer, { width: imageSize, height: imageSize }]}>
                        <WRText style={styles.remainingCountText}>+{remainingCount}</WRText>
                    </View>
                )}
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            width: '100%',
        },
        listButton: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
            ...(style as ViewStyle)
        },
        buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
        },
        placeholderText: {
            color: theme.colors.muted,
            flex: 1,
            marginRight: 8
        },
        previewImagesContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 8
        },
        previewImageWrapper: {
            borderRadius: imageSize / 2,
            borderWidth: 2,
            borderColor: theme.colors.background,
            overflow: 'hidden'
        },
        previewImage: {
            borderRadius: imageSize / 2
        },
        remainingCountContainer: {
            backgroundColor: theme.colors.muted,
            borderRadius: imageSize / 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: -8,
            borderWidth: 2,
            borderColor: theme.colors.background
        },
        remainingCountText: {
            color: theme.colors.background,
            fontSize: 10,
            fontWeight: '600'
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        modalContent: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            width: '90%',
            maxHeight: modalHeight,
            padding: 16
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text
        },
        closeButton: {
            padding: 8
        },
        itemsList: {
            marginTop: 8
        },
        item: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: theme.colors.background,
            flexDirection: 'row',
            alignItems: 'center'
        },
        itemImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12
        },
        itemIcon: {
            marginRight: 12
        },
        itemContent: {
            flex: 1
        },
        itemTextContainer: {
            flex: 1
        },
        itemLabel: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: '500'
        },
        itemDescription: {
            color: theme.colors.muted,
            fontSize: 14,
            marginTop: 2
        },
        emptyState: {
            padding: 20,
            alignItems: 'center'
        },
        emptyStateText: {
            color: theme.colors.muted,
            fontSize: 16
        },
        selectAllContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        selectAllButton: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            backgroundColor: theme.colors.primary
        },
        selectAllButtonDisabled: {
            backgroundColor: theme.colors.muted
        },
        selectAllText: {
            color: theme.colors.background,
            fontSize: 14,
            fontWeight: '600'
        },
        checkbox: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        checkboxSelected: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary
        },
        itemContentSelectable: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
        }
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.listButton}
                onPress={() => !disabled && setIsOpen(true)}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <View style={styles.buttonContent}>
                    {renderPreviewImages()}
                </View>
                <UIIcon
                    name="chevron-down"
                    size={20}
                    color={theme.colors.text}
                />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <WRText style={styles.modalTitle}>
                                {selectable ? `Selecionar ${title}` : title}
                            </WRText>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsOpen(false)}
                            >
                                <UIIcon
                                    name="close"
                                    size={24}
                                    color={theme.colors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        {selectable && showSelectAll && (
                            <View style={styles.selectAllContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.selectAllButton,
                                        currentSelectedValues.length === items.length && styles.selectAllButtonDisabled
                                    ]}
                                    onPress={handleSelectAll}
                                    disabled={currentSelectedValues.length === items.length}
                                >
                                    <WRText style={styles.selectAllText}>Selecionar Todos</WRText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.selectAllButton,
                                        (currentSelectedValues.length === 0 || 
                                         (minSelected > 0 && currentSelectedValues.length <= minSelected)) && styles.selectAllButtonDisabled
                                    ]}
                                    onPress={handleDeselectAll}
                                    disabled={currentSelectedValues.length === 0 || 
                                             (minSelected >0 && currentSelectedValues.length <= minSelected)}
                                >
                                    <WRText style={styles.selectAllText}>Desselecionar Todos</WRText>
                                </TouchableOpacity>
                            </View>
                        )}

                        <ScrollView style={styles.itemsList}>
                            {items.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <WRText style={styles.emptyStateText}>
                                        Nenhum item encontrado
                                    </WRText>
                                </View>
                            ) : (
                                items.map((item, index) => {
                                    const isSelected = selectable && currentSelectedValues.includes(item.value);
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={styles.item}
                                            onPress={() => selectable && handleSelectionToggle(item.value)}
                                            disabled={!selectable}
                                        >
                                            {selectable && (
                                                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                                    {isSelected && (
                                                        <UIIcon
                                                            name="checkbox"
                                                            size={12}
                                                            color={theme.colors.background}
                                                        />
                                                    )}
                                                </View>
                                            )}
                                            {item.image && (
                                                <ItemImage
                                                    image={item.image}
                                                    style={styles.itemImage}
                                                />
                                            )}
                                            {item.icon && !item.image && (
                                                <View style={styles.itemIcon}>
                                                    <UIIcon
                                                        name={item.icon}
                                                        size={24}
                                                        color={theme.colors.primary}
                                                    />
                                                </View>
                                            )}
                                            <View style={selectable ? styles.itemTextContainer : styles.itemContent}>
                                                <WRText style={styles.itemLabel}>
                                                    {item.label}
                                                </WRText>
                                                {item.description && (
                                                    <WRText style={styles.itemDescription}>
                                                        {item.description}
                                                    </WRText>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}