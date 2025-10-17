import {
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { setColumnVisibility } from '@/store/itemTableSlice'

const ColumnVisibilityControl: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const columnVisibility = useSelector((state: RootState) => state.itemTable)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColumnToggle = (column: string) => {
    dispatch(
      setColumnVisibility({ column, visible: !columnVisibility[column] })
    )
  }

  return (
    <div>
      <Button
        aria-controls="column-visibility-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
      >
        {t('common:columns')}
      </Button>
      <Menu
        id="column-visibility-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(columnVisibility).map((column) => (
          <MenuItem key={column} onClick={() => handleColumnToggle(column)}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={columnVisibility[column]}
                  onChange={() => handleColumnToggle(column)}
                />
              }
              label={t(`common:${column}`)}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ColumnVisibilityControl