/**
 * Navigation editor item components.
 * Contains sortable row renderer and shared icon components for the editor UI.
 */
import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import style from '@features/navigation/components/navigation-edit/navigationEdit.module.css';
import InputWithLabel from '@components/input-label/InputWithLabel';
import { createChildNavigation } from '@features/navigation/services/navigate';

import plus from '@assets/icons/plus.svg';
import minus from '@assets/icons/minus.svg';

/**
 * Renders one sortable navigation row with optional child menu management.
 * @param {object} props - Sortable item props.
 * @returns {JSX.Element} Sortable row UI.
 */
function SortableItem({
  item,
  burgerIcon,
  handleDeleteItem,
  handleDeleteChild,
  setNavigationItems,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [childForm, setChildForm] = useState({ name: '', path: '' });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item._id });

  const initialStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  /**
   * Updates child creation form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   * @returns {void}
   */
  const handleChildInputChange = (e) => {
    const { name, value } = e.target;
    setChildForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Creates child navigation item and replaces updated parent locally.
   * @returns {Promise<void>}
   */
  const onAddChildCLick = async () => {
    if (!childForm.name || !childForm.path) return;

    try {
      const response = await createChildNavigation(item._id, childForm);
      const updatedParent = response.json || response;

      setNavigationItems((prev) =>
        prev.map((nav) => (nav._id === item._id ? updatedParent : nav))
      );

      setChildForm({ name: '', path: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add child:', error);
    }
  };

  return (
    <div ref={setNodeRef} style={initialStyle}>
      <div className={style.navigationEdit_list_item}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
          <img src={burgerIcon} alt='Burger-Icon' />
        </div>
        <span className={style.navigationEdit_list_item_name}>{item.name}</span>
        <button
          className={` ${
            isOpen
              ? style.navigationEdit_list_item_minus
              : style.navigationEdit_list_item_plus
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <img src={minus} alt='Minus' />
          ) : (
            <img src={plus} alt='Plus' />
          )}
        </button>

        <button
          className={style.navigationEdit__delete_item}
          onClick={handleDeleteItem}
        >
          X
        </button>
      </div>

      {item.childMenu && item.childMenu.length > 0 && (
        <div className={style.navigationEdit_child_list}>
          {item.childMenu.map((child) => (
            <div key={child._id} className={style.navigationEdit_child_item}>
              <span className={style.child_name}>{child.name}</span>
              <button
                className={style.navigationEdit__delete_item}
                onClick={() => handleDeleteChild(item._id, child._id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className={style.navigationEdit_list_item_children}>
          <div className={style.navigationEdit_list_item_children_input}>
            <InputWithLabel
              type='text'
              name='name'
              labelText='Name'
              changeValue={handleChildInputChange}
              value={childForm.name}
            />
            <InputWithLabel
              type='text'
              name='path'
              labelText='Path'
              changeValue={handleChildInputChange}
              value={childForm.path}
            />
          </div>
          <button
            className={style.navigationEdit_list_item_add_child}
            onClick={onAddChildCLick}
          >
            Add Child
          </button>
        </div>
      )}
    </div>
  );
}

export { SortableItem };
