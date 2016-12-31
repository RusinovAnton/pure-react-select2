import React from 'react'
import Select from '../src/components/Select'
import renderer from 'react-test-renderer'



const dummyData = [
    { id: 3, text: 'three' },
    { id: 4, text: 'four' },
    { id: 5, text: 'five' },
]

it('should render a Select container', () => {
    const wrapper = shallow(<Select/>);
    expect(wrapper).toMatchSnapshot();
});

/*test('Open dropdown on container click', () => {
 const component = renderer.create(<Select/>)

 let tree = component.toJSON()

 expect(tree).toMatchSnapshot()

 // manually trigger the callback
 tree.refs.selectContainer.onClick()

 // re-rendering
 tree = component.toJSON()

 expect(tree).toMatchSnapshot()

 // manually trigger the callback
 tree.refs.selectContainer.onClick()

 // re-rendering
 tree = component.toJSON()
 expect(tree).toMatchSnapshot()
 })*/
