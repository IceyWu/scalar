<script setup lang="ts">
import { HttpMethod } from '@scalar/api-client'

import { useNavState, useSidebar } from '../../../hooks'
import type { Tag, TransformedOperation } from '../../../types'
import { Anchor } from '../../Anchor'
import { Card, CardContent, CardHeader } from '../../Card'
import { MarkdownRenderer } from '../../MarkdownRenderer'
import {
  Section,
  SectionColumn,
  SectionColumns,
  SectionContent,
  SectionHeader,
} from '../../Section'

const props = defineProps<{ id?: string; tag: Tag }>()

const { getOperationId, getTagId } = useNavState()
const { setCollapsedSidebarItem } = useSidebar()

// We need to make sure the endpoint tag is open before
// we try to scroll to it
// we wait for next render after we open the tag
// TODO in V2 we need to do the same loading trick as the initial load
async function scrollHandler(operation: TransformedOperation) {
  setCollapsedSidebarItem(getTagId(props.tag), true)

  setTimeout(() => {
    window.location.href = `#${getOperationId(operation, props.tag)}`
  }, 0)
}
</script>
<template>
  <Section
    :id="id"
    :label="tag.name.toUpperCase()">
    <SectionContent>
      <SectionColumns>
        <SectionColumn>
          <SectionHeader :level="2">
            <Anchor :id="getTagId(tag)">
              {{ tag.name }}
            </Anchor>
          </SectionHeader>
          <MarkdownRenderer :value="tag.description" />
        </SectionColumn>
        <SectionColumn>
          <template v-if="tag.operations?.length > 0">
            <Card class="scalar-card-sticky">
              <CardHeader muted>Endpoints</CardHeader>
              <CardContent
                class="custom-scroll"
                muted>
                <div class="endpoints">
                  <a
                    v-for="operation in tag.operations"
                    :key="getOperationId(operation, tag)"
                    class="endpoint"
                    @click="scrollHandler(operation)">
                    <HttpMethod :method="operation.httpVerb" />
                    <span>{{ operation.path }}</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </template>
        </SectionColumn>
      </SectionColumns>
    </SectionContent>
  </Section>
</template>
<style scoped>
.endpoints {
  overflow: auto;
  background: var(--theme-background-2, var(--default-theme-background-2));
  padding: 10px 12px;
}
@media (max-width: 580px) {
  .endpoints {
    max-height: calc(100vh - 150px);
  }
}
.endpoints span + span {
  text-align: left;
  margin-left: 12px;
  text-transform: initial;
}

.endpoint {
  display: flex;
  white-space: nowrap;
  cursor: pointer;
}
.endpoint span:first-of-type {
  text-transform: uppercase;
}
.endpoint .post,
.endpoint .get,
.endpoint .delete,
.endpoint .put {
  white-space: nowrap;
}
.endpoint span {
  color: var(--theme-color-1, var(--default-theme-color-1));
  min-width: 62px;
  display: inline-block;
  text-align: right;
  line-height: 1.55;
  font-family: var(--theme-font-code, var(--default-theme-font-code));
  font-size: var(--theme-small, var(--default-theme-small));
  cursor: pointer;
}
</style>
