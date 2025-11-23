import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    Chip,
    Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import type { Item } from '@/types';

interface ItemDetailModalProps {
    open: boolean;
    item: Item | null;
    onClose: () => void;
    onEdit: (item: Item) => void;
    onDelete: (itemId: number) => void;
    canEdit: boolean;
    canDelete: boolean;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
    open,
    item,
    onClose,
    onEdit,
    onDelete,
    canEdit,
    canDelete,
}) => {
    const { t } = useTranslation();

    if (!item) return null;

    const handleEdit = () => {
        onEdit(item);
        onClose();
    };

    const handleDelete = () => {
        onDelete(item.id);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" component="div">
                    {item.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    ID: {item.id}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('common:quantity')}
                        </Typography>
                        <Typography variant="body1">
                            {item.quantity} <Chip label={item.unit} size="small" />
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('common:category')}
                        </Typography>
                        <Typography variant="body1">
                            {item.category?.name || t('common:none')}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('common:department')}
                        </Typography>
                        <Typography variant="body1">
                            {item.department?.name || t('common:none')}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('common:createdAt')}
                        </Typography>
                        <Typography variant="body1">
                            {format(new Date(item.creationDate), 'PPp')}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t('common:updatedAt')}
                        </Typography>
                        <Typography variant="body1">
                            {format(new Date(item.updatedOn), 'PPp')}
                        </Typography>
                    </Grid>

                    {item.observations && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {t('common:observations')}
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {item.observations}
                            </Typography>
                        </Grid>
                    )}

                    {item.characteristics && Object.keys(item.characteristics).length > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" gutterBottom>
                                {t('common:characteristics')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {Object.entries(item.characteristics).map(([key, value]) => (
                                    <Chip
                                        key={key}
                                        label={`${key}: ${value}`}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    {t('common:back')}
                </Button>
                {canEdit && (
                    <Button onClick={handleEdit} variant="contained" color="primary">
                        {t('common:edit')}
                    </Button>
                )}
                {canDelete && (
                    <Button onClick={handleDelete} variant="contained" color="error">
                        {t('common:delete')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ItemDetailModal;
