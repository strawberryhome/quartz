import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

function HorizontalRule({ displayClass }: QuartzComponentProps) {
  return <hr class={classNames(displayClass, "horizontalrule")} />
}

export default (() => HorizontalRule) satisfies QuartzComponentConstructor
