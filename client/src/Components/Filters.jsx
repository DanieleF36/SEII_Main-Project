import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function FilterContainer(props) {

  return (
    <Card style={{ width: '235px', maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <img src='./search.svg' />&nbsp; Search
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="title"
                  value={props.filters.title}
                  onChange={props.handleFilterChange}
                  placeholder="Title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="supervisor"
                  value={props.filters.supervisor}
                  onChange={props.handleFilterChange}
                  placeholder="Supervisor Surname"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="cosupervisor"
                  value={props.filters.cosupervisor}
                  onChange={props.handleFilterCoSupChange}
                  placeholder="Cosupervisors Surnames"
                />
              </Form.Group>
              <p><strong>Expiration Date</strong></p>
              <Form.Group className="mb-3">
                <Form.Control
                  type="date"
                  name="expDate"
                  value={props.filters.expDate}
                  onChange={props.handleFilterChange}
                />
              </Form.Group>
              <p><strong>Creation Date</strong></p>
              <Form.Group className="mb-3">
                <Form.Control
                  type="date"
                  name="creatDate"
                  value={props.filters.creatDate}
                  onChange={props.handleFilterChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="keywords"
                  value={props.filters.keywords}
                  onChange={props.handleFilterChange}
                  placeholder="Keywords"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="type"
                  value={props.filters.type}
                  onChange={props.handleFilterChange}
                  placeholder="Type"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="groups"
                  value={props.filters.groups}
                  onChange={props.handleFilterChange}
                  placeholder="Groups"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="know"
                  value={props.filters.know}
                  onChange={props.handleFilterChange}
                  placeholder="Knowledge"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="cds"
                  value={props.filters.cds}
                  onChange={props.handleFilterChange}
                  placeholder="CdS"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <p><strong>Ordering</strong></p>
                <Form.Control
                  as="select"
                  name="order"
                  value={props.filters.order}
                  onChange={props.handleFilterChange}
                >
                  <option value="">Order</option>
                  <option value="A">Ascendent</option>
                  <option value="D">Descendent</option>
                </Form.Control>
                <Form.Control
                  as="select"
                  name="orderby"
                  value={props.filters.orderby}
                  onChange={props.handleFilterChange}
                >
                  <option value="">Order by</option>
                  <option value="title">Title</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="expDate">ExpDate</option>
                </Form.Control>
              </Form.Group>
              {/* Add other filter input fields here */}
              <Button variant="primary" onClick={props.handleApplyFilters}>
                Search
              </Button>
              <br />
              <Button variant="danger" onClick={props.handleResetChange} style={{ marginTop: '5px' }}>
                Reset Filters
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}

export { FilterContainer };