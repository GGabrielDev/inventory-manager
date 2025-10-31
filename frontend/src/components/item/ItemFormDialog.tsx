import RemoveIcon from '@mui/icons-material/Remove'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  useCategoryManagement,
  useDepartmentManagement,
  useItemManagement,
} from '@/hooks'
import type { ItemFormData, ItemFormDialogProps, UnitType } from '@/types'

const ItemFormDialog: React.FC<ItemFormDialogProps> = ({
  open,
  item,
  onClose,
  onSuccess,
  canEdit,
  canCreate,
  canGetCategory,
  canGetDepartment,
}) => {
  const { t } = useTranslation()
  const { createItem, updateItem, error, setError } = useItemManagement()
  const { categories, fetchCategories } = useCategoryManagement()
  const { departments, fetchDepartments } = useDepartmentManagement()

  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    quantity: 1,
    unit: 'und.' as UnitType,
    categoryId: undefined,
    departmentId: 0,
    observations: '',
    characteristics: {},
  })

  const [loading, setLoading] = useState(false)

  const characteristicsOptions = [
    'color',
    'brand',
    'model',
    'serialNumber',
    'productNumber',
  ]

  useEffect(() => {
    if (open) {
      if (canGetCategory) {
        fetchCategories()
      }
      if (canGetDepartment) {
        fetchDepartments()
      }
    }
  }, [open, canGetCategory, canGetDepartment, fetchCategories, fetchDepartments])

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        categoryId: item.categoryId,
        departmentId: item.departmentId,
        observations: item.observations || '',
        characteristics: item.characteristics || {},
      })
    } else {
      setFormData({
        name: '',
        quantity: 1,
        unit: 'und.' as UnitType,
        categoryId: undefined,
        departmentId: 0,
        observations: '',
        characteristics: {},
      })
    }
    setError('')
  }, [item, setError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let success = false
      if (item && canEdit) {
        success = await updateItem(item.id, formData)
      } else if (!item && canCreate) {
        success = await createItem(formData)
      }

      if (success) {
        onSuccess()
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      quantity: 1,
      unit: 'und.' as UnitType,
      categoryId: undefined,
      departmentId: 0,
      observations: '',
      characteristics: {},
    })
    setError('')
    onClose()
  }

  const handleAddCharacteristic = (key: string) => {
    setFormData({
      ...formData,
      characteristics: { ...formData.characteristics, [key]: '' },
    })
  }

  const handleRemoveCharacteristic = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...newCharacteristics } = formData.characteristics
    setFormData({ ...formData, characteristics: newCharacteristics })
  }

  const handleCharacteristicChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      characteristics: { ...formData.characteristics, [key]: value },
    })
  }

  const isEditing = !!item
  const canSubmit = isEditing ? canEdit : canCreate

  const unitOptions = [
    { value: 'und.', label: t('common:units.und') },
    { value: 'kg', label: t('common:units.kg') },
    { value: 'l', label: t('common:units.l') },
    { value: 'm', label: t('common:units.m') },
  ]

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? t('common:edit') : t('common:create')}{' '}
          {t('common:item')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('common:name')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading || !canSubmit}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label={t('common:quantity')}
            type="number"
            fullWidth
            variant="outlined"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 1,
              })
            }
            required
            disabled={loading || !canSubmit}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{t('common:unit')}</InputLabel>
            <Select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value as UnitType })
              }
              label={t('common:unit')}
              disabled={loading || !canSubmit}
            >
              {unitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{t('common:department')}</InputLabel>
            <Select
              value={formData.departmentId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  departmentId: Number(e.target.value),
                })
              }
              label={t('common:department')}
              disabled={loading || !canSubmit || !canGetDepartment}
              required
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{t('common:category')}</InputLabel>
            <Select
              value={formData.categoryId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              label={t('common:category')}
              disabled={loading || !canSubmit || !canGetCategory}
            >
              <MenuItem value="">
                <em>{t('common:none')}</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label={t('common:observations')}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.observations}
            onChange={(e) =>
              setFormData({ ...formData, observations: e.target.value })
            }
            disabled={loading || !canSubmit}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>{t('common:characteristics')}</InputLabel>
            <Select
              value=""
              onChange={(e) => handleAddCharacteristic(e.target.value)}
              label={t('common:characteristics')}
              disabled={loading || !canSubmit}
            >
              {characteristicsOptions
                .filter(
                  (key) =>
                    !Object.prototype.hasOwnProperty.call(
                      formData.characteristics,
                      key
                    )
                )
                .map((key) => (
                  <MenuItem key={key} value={key}>
                    {t(`common:${key}`)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {Object.keys(formData.characteristics).map((key) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                margin="dense"
                label={t(`common:${key}`)}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.characteristics[key]}
                onChange={(e) =>
                  handleCharacteristicChange(key, e.target.value)
                }
                disabled={loading || !canSubmit}
              />
              <IconButton
                onClick={() => handleRemoveCharacteristic(key)}
                disabled={loading || !canSubmit}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}

          {error && (
            <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t('common:cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              loading ||
              !canSubmit ||
              !formData.name.trim() ||
              !formData.departmentId
            }
          >
            {loading
              ? t('common:saving')
              : isEditing
              ? t('common:update')
              : t('common:create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ItemFormDialog