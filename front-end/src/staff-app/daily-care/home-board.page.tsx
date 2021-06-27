import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { connect } from "react-redux"
import { NameDisplay, StoreState } from "types"
import * as actions from "../../actions"
import { faArrowUp, faArrowDown, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';

export function mapStateToProps({ students }: StoreState) {
  return {
    students,
  }
}

export function mapDispatchToProps(dispatch: any) {
  return {
    setStudents: (students?: Person[]) => dispatch(actions.setStudents(students)),
  }
}

interface IHomeBoardProps extends StoreState {
  setStudents: (students?: Person[]) => void
}

export const HomeBoard: React.FC<IHomeBoardProps> = (props) => {
  const { setStudents, students } = props
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [currentName, setCurrentName] = useState({ name: "First Name", value: "first_name" })
  const [sortOrder, setSortOrder] = useState("desc")
  const [isSorting, setIsSorting] = useState(false)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudents(data?.students)
  }, [data, data?.students])

  const onToolbarAction = (action: ToolbarAction, event:any) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === 'sort') {
      event?.stopPropagation();
      setIsSorting(true);
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortOrder('desc');
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }
  
  const sortStudents = (nextStudent: any, prevStudent: any) => {
    if (!isSorting) {
      return 1;
    } else {
      if (sortOrder === 'desc') {
        return nextStudent.first_name > prevStudent.first_name ? -1 : 1;
      } else {
        return nextStudent.first_name < prevStudent.first_name ? -1 : 1;
      }
    }
  };

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} nameDisplay={currentName} sortOrder={sortOrder} isSorting={isSorting} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {[...students].sort(sortStudents).map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

const HomeBoardPage = connect(mapStateToProps, mapDispatchToProps)(HomeBoard)

export { HomeBoardPage }

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  nameDisplay: NameDisplay
  sortOrder: string
  isSorting: boolean
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, nameDisplay, sortOrder, isSorting } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>
        {nameDisplay.name}
        {sortOrder === "desc" ? (
          <FontAwesomeIcon className="nameSortIcon" icon={isSorting ? faArrowDown : faArrowsAltV} size="1x" onClick={(e: any) => onItemClick("sort", e)} />
        ) : (
          <FontAwesomeIcon className="nameSortIcon" icon={faArrowUp} size="1x" onClick={(e: any) => onItemClick("sort", e)} />
        )}
      </div>
      <div>Search</div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
