import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { ActivityPayload } from "types"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ActivityPage: React.FC = () => {
  const [getStudents, data, loadState] = useApi<{ activity: ActivityPayload[] }>({ url: "get-activities" })

  useEffect(() => {
    void getStudents()
  }, [])

  return (
    <S.Container>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {loadState === "loaded" &&
        data?.activity.map((list: any, i) => {
          return (
            <S.ActivityItems key={i}>
              <span>{list.entity.name}</span>
            </S.ActivityItems>
          )
        })}

      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  ActivityItems: styled.div<{ key: number }>`
    display: flex;
    justify-content: space-between;
    height: 70px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 7px rgb(5 66 145 / 13%);
    margin-top: 12px;
    align-items: center;
    padding: 0 10px 0 10px;
    color: #4e4e4e;
    font-weight: 600;
    flex-wrap: wrap;
  `,
}
