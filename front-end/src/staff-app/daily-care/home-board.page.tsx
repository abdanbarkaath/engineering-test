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
import { TextField } from "@material-ui/core"
import { RollInput } from "shared/models/roll"

export function mapStateToProps({ students, rollStatus }: StoreState) {
  return {
    students,
    rollStatus
  }
}

export function mapDispatchToProps(dispatch: any) {
  return {
    setStudents: (students?: Person[]) => dispatch(actions.setStudents(students)),
    setRollStatus: (type: string) => dispatch(actions.setRollStatus(type)),
  }
}

interface IHomeBoardProps extends StoreState {
  setStudents: (students?: Person[]) => void
  setRollStatus: (type: string) => void;
}

export const HomeBoard: React.FC<IHomeBoardProps> = (props) => {
  const { setStudents, students, rollStatus, setRollStatus } = props
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [setStudentsApi] = useApi<{ student: RollInput }>({ url: 'save-roll' });
  const [currentName, setCurrentName] = useState({ name: "First Name", value: "first_name" })
  const [sortOrder, setSortOrder] = useState("desc")
  const [isSorting, setIsSorting] = useState(false)
  const [searching, setSearch] = useState(false)
  const [query, setQuery] = useState('')

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
    if (action === 'name') {
      event?.stopPropagation();
      setStudents(data?.students);
      setSortOrder('desc');
      setIsSorting(false);
      if (currentName.name === 'First Name') {
        setCurrentName({ name: 'Last Name', value: 'last_name' });
      } else {
        setCurrentName({ name: 'First Name', value: 'first_name' });
      }
    }
    if (action === 'search') {
      if (event?.target?.value.length > 0) {
        setQuery(event?.target?.value?.toLowerCase().trim());
        setSearch(true);
      } else if (event?.target?.value.length === 0) {
        setSearch(false);
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction, value?: string) => {
    if (action === "exit") {
      setIsRollMode(false)
    } else if (action === "filter") {
      if(value){
        setRollStatus(value);
      }
    } else if (action === "save") {
      students.forEach((student: Person) => {
        let studentState = {
          student_id: student.id,
          roll_state: student?.rollState || 'unmark',
        };
        setStudentsApi(studentState);
        setIsRollMode(false);
      });
    }
  }

  const sortStudents = (nextStudent: any, prevStudent: any) => {
    if (!isSorting) {
      return 1;
    } else {
      if (sortOrder === 'desc') {
        return nextStudent[`${currentName.value}`] > prevStudent[`${currentName.value}`] ? -1 : 1;
      } else {
        return nextStudent[`${currentName.value}`] < prevStudent[`${currentName.value}`] ? -1 : 1;
      }
    }
  };

  const searchQuery = (student: Person) => {
    if (searching) {
      let studentName = student.first_name.toLowerCase().concat(' ', student.last_name.toLowerCase());
      return studentName.indexOf(query) > -1;
    } else {
      return true;
    }
  };

  const filterByAttendance = (student: Person) => {
    if (rollStatus === "all") {
      return student;
    }
    return student.rollState === rollStatus;
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
            {[...students].sort(sortStudents).filter(searchQuery).filter(filterByAttendance).map((s) => (
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
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} students={students} />
    </>
  )
}

const HomeBoardPage = connect(mapStateToProps, mapDispatchToProps)(HomeBoard)

export { HomeBoardPage }

type ToolbarAction = "roll" | "sort" | "name" | "search"
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
      <div className="toolbarName" onClick={(e:any) => onItemClick("name", e)}>
        {nameDisplay.name}
        {sortOrder === "desc" ? (
          <FontAwesomeIcon className="nameSortIcon" icon={isSorting ? faArrowDown : faArrowsAltV} size="1x" onClick={(e: any) => onItemClick("sort", e)} />
        ) : (
          <FontAwesomeIcon className="nameSortIcon" icon={faArrowUp} size="1x" onClick={(e: any) => onItemClick("sort", e)} />
        )}
      </div>
      <TextField id="standard-basic" placeholder="Search" multiline={false} onChange={(e: any) => onItemClick('search', e)} />
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
